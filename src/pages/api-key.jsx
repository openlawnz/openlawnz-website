/* eslint-env browser, es2021 */
import { useEffect, useState } from "react"

import HeroSmall from "@/components/hero/hero-small"
import Layout from "@/components/layout/layout"
import SEO from "@/components/seo"

// Self-service API key page.
//
// Flow (Authorization Code + PKCE, public Cognito app client — no secret):
//  1. User clicks "Get my API key" -> we generate a PKCE verifier/challenge,
//     stash the verifier in sessionStorage, and redirect to the Cognito
//     Hosted UI to sign up / sign in.
//  2. Cognito redirects back here with ?code=...  The PostConfirmation Lambda
//     has by then created the key and stored it on the user as custom:api_key.
//  3. We exchange the code for tokens and call the Cognito GetUser API with the
//     access token to read custom:api_key. (Custom attributes are NOT reliably
//     emitted as ID-token claims via the Hosted UI, so we use GetUser instead —
//     which is why the client requests the aws.cognito.signin.user.admin scope.)
//
// Required env vars (set in Netlify + .env.development), all GATSBY_-prefixed
// so they are available in the browser:
//   GATSBY_COGNITO_DOMAIN       e.g. https://ap-southeast-2m9y9gwbjw.auth.ap-southeast-2.amazoncognito.com
//   GATSBY_COGNITO_CLIENT_ID    e.g. 7q3epnqr3gjmamvmlbepabfd1e
//   GATSBY_COGNITO_REDIRECT_URI e.g. https://www.openlaw.nz/api-key  (must EXACTLY match a callback URL on the app client)
//   GATSBY_COGNITO_REGION       e.g. ap-southeast-2

const COGNITO_DOMAIN = process.env.GATSBY_COGNITO_DOMAIN
const CLIENT_ID = process.env.GATSBY_COGNITO_CLIENT_ID
const REDIRECT_URI = process.env.GATSBY_COGNITO_REDIRECT_URI
const REGION = process.env.GATSBY_COGNITO_REGION
const SCOPES = "openid email aws.cognito.signin.user.admin"

const VERIFIER_KEY = "pkce_verifier"

// --- PKCE helpers (browser only) ---

function base64UrlEncode(bytes) {
  let str = ""
  const arr = new Uint8Array(bytes)
  for (let i = 0; i < arr.byteLength; i++) str += String.fromCharCode(arr[i])
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function randomVerifier() {
  const arr = new Uint8Array(64)
  window.crypto.getRandomValues(arr)
  return base64UrlEncode(arr)
}

async function challengeFromVerifier(verifier) {
  const digest = await window.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier)
  )
  return base64UrlEncode(digest)
}

async function authParams() {
  const verifier = randomVerifier()
  sessionStorage.setItem(VERIFIER_KEY, verifier)
  const challenge = await challengeFromVerifier(verifier)
  return new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    code_challenge_method: "S256",
    code_challenge: challenge,
  })
}

async function startLogin() {
  const params = await authParams()
  // Use /signup to land on the sign-up form first; swap to /login for sign-in.
  window.location.assign(`${COGNITO_DOMAIN}/signup?${params.toString()}`)
}

// Clear the Cognito SSO session, then immediately re-run authorize so the new
// token is minted with the requested scopes (needed if an older session issued
// a token without aws.cognito.signin.user.admin).
async function forceLogout() {
  const params = await authParams()
  window.location.assign(`${COGNITO_DOMAIN}/logout?${params.toString()}`)
}

async function exchangeCode(code) {
  const verifier = sessionStorage.getItem(VERIFIER_KEY)
  if (!verifier) {
    throw new Error(
      "Missing PKCE verifier — start the sign-in from this page rather than pasting a link."
    )
  }
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: verifier,
  })
  const res = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  })
  if (!res.ok) {
    throw new Error(`Token exchange failed (${res.status})`)
  }
  const tokens = await res.json()
  sessionStorage.removeItem(VERIFIER_KEY)
  return tokens // { id_token, access_token, refresh_token, ... }
}

// Read the user's own attributes (incl. custom:*) via the Cognito GetUser API.
async function getUserAttributes(accessToken) {
  const res = await fetch(`https://cognito-idp.${REGION}.amazonaws.com/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Target": "AWSCognitoIdentityProviderService.GetUser",
    },
    body: JSON.stringify({ AccessToken: accessToken }),
  })
  if (!res.ok) {
    const text = await res.text()
    const err = new Error(`GetUser failed (${res.status})`)
    err.scopeProblem = text.includes("required scopes")
    throw err
  }
  const data = await res.json()
  const attrs = {}
  ;(data.UserAttributes || []).forEach(a => (attrs[a.Name] = a.Value))
  return attrs
}

const ApiKeyPage = () => {
  const [status, setStatus] = useState("idle") // idle | working | done | error
  const [apiKey, setApiKey] = useState(null)
  const [email, setEmail] = useState(null)
  const [error, setError] = useState(null)
  const [needsLogout, setNeedsLogout] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const url = new URL(window.location.href)
    const code = url.searchParams.get("code")
    const oauthError = url.searchParams.get("error_description")

    if (oauthError) {
      setStatus("error")
      setError(oauthError)
      return
    }
    if (!code) return // first visit — show the button

    setStatus("working")
    exchangeCode(code)
      .then(async tokens => {
        // Clean the ?code= out of the address bar so a refresh doesn't re-exchange.
        window.history.replaceState({}, document.title, url.pathname)
        const attrs = await getUserAttributes(tokens.access_token)
        if (!attrs["custom:api_key"]) {
          throw new Error(
            "Signed in, but no API key was found on your account yet. Try again in a moment."
          )
        }
        setApiKey(attrs["custom:api_key"])
        setEmail(attrs.email)
        setStatus("done")
      })
      .catch(err => {
        setStatus("error")
        setError(err.message)
        setNeedsLogout(Boolean(err.scopeProblem))
      })
  }, [])

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <Layout>
      <SEO
        title="API key"
        description="Generate a personal API key for the OpenLaw NZ API."
      />
      <HeroSmall title="API key" />
      <div className="inner">
        <div className="body-wrap content-page">
          {status === "idle" && (
            <>
              <p>
                Sign up (or sign in) to instantly generate a personal key for the
                OpenLaw NZ API. Once you verify your email, your key is created
                automatically and shown here.
              </p>
              <button className="button" onClick={startLogin}>
                Get my API key
              </button>
            </>
          )}

          {status === "working" && <p>Finishing sign-in and fetching your key…</p>}

          {status === "done" && (
            <>
              <p>
                Your API key{email ? ` for ${email}` : ""} is ready. Keep it
                private — treat it like a password.
              </p>
              <pre
                style={{
                  background: "#f6f8fa",
                  padding: "12px",
                  borderRadius: "6px",
                  overflowX: "auto",
                }}
              >
                {apiKey}
              </pre>
              <button className="button" onClick={copyKey}>
                {copied ? "Copied!" : "Copy key"}
              </button>
              <p style={{ marginTop: "1rem" }}>
                Send it with each request as the <code>x-api-key</code> header.
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <p>Sorry, something went wrong:</p>
              <pre
                style={{
                  background: "#fff4f4",
                  padding: "12px",
                  borderRadius: "6px",
                }}
              >
                {error}
              </pre>
              <button
                className="button"
                onClick={needsLogout ? forceLogout : startLogin}
              >
                {needsLogout ? "Sign out & try again" : "Try again"}
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default ApiKeyPage
