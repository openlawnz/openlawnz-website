import AzureSearchClient from "./AzureSearchClient.js"

const TURNSTILE_TIMEOUT_MS = 5000
const IS_PRODUCTION = process.env.NODE_ENV === "production" || process.env.CONTEXT === "production"

function sanitizeString(str) {
  return String(str || "")
    .replace(/[^a-z0-9áéíóúñü~" ., _-]/gim, "")
    .trim()
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timeoutId)
  }
}

function logError(message, error) {
  if (IS_PRODUCTION) {
    console.error(message)
    return
  }

  console.error(message, error)
}

/**
 * Verify Cloudflare Turnstile token
 * @param {string} token - The Turnstile token from the client
 * @param {string} ip - The client's IP address (optional but recommended)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function verifyTurnstileToken(token, ip) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY

  if (!secretKey) {
    if (IS_PRODUCTION) {
      return { success: false, error: "Verification service misconfigured" }
    }

    return { success: true }
  }

  if (!token) {
    return { success: false, error: "Missing Turnstile token" }
  }

  try {
    const formData = new URLSearchParams()
    formData.append("secret", secretKey)
    formData.append("response", token)

    if (ip) {
      formData.append("remoteip", ip)
    }

    const response = await fetchWithTimeout(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      },
      TURNSTILE_TIMEOUT_MS
    )

    const result = await response.json()

    if (!result.success) {
      return { success: false, error: "Verification failed" }
    }

    return { success: true }
  } catch (error) {
    logError("Turnstile verification error", error)
    return { success: false, error: "Verification service error" }
  }
}

export default async (request, context) => {
  const turnstileToken = request.headers.get("X-Turnstile-Token")
  // context.ip is Netlify-specific; fall back to x-forwarded-for header.
  // clientIP may be undefined if neither is available — verifyTurnstileToken handles this.
  const clientIP = context.ip || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()

  const verification = await verifyTurnstileToken(turnstileToken, clientIP)
  if (!verification.success) {
    if (verification.error === "Verification service misconfigured") {
      return Response.json({ error: "Verification service misconfigured" }, { status: 500 })
    }

    return Response.json({ error: "Bot verification failed" }, { status: 403 })
  }

  const url = new URL(request.url)
  const q = url.searchParams.get("q")

  if (!q) {
    return Response.json({ error: "Missing required parameter: q" }, { status: 400 })
  }

  const { SERVICE_NAME, QUERY_KEY, INDEX_NAME, SEARCH_ENV } = process.env
  if (!SERVICE_NAME || !QUERY_KEY || !INDEX_NAME || !SEARCH_ENV) {
    return Response.json({ error: "Search service misconfigured" }, { status: 500 })
  }

  const client = new AzureSearchClient(SERVICE_NAME, QUERY_KEY, `${INDEX_NAME}-${SEARCH_ENV}`)

  try {
    const rawOffset = url.searchParams.get("p")
    const numericOffset = Number.parseInt(rawOffset || "0", 10)
    const p = Number.isNaN(numericOffset) || numericOffset < 0 ? "0" : String(numericOffset)
    const court = url.searchParams.get("court") || ""
    const location = url.searchParams.get("location") || ""

    const result = await client
      .queryAsync(sanitizeString(q), sanitizeString(p), sanitizeString(court), sanitizeString(location))
      .then((response) => response.json())

    const data = {
      count: result["@odata.count"],
      results: result.value.map((item) => ({
        caseName: item.caseNames[0],
        caseDate: item.caseDate,
        caseCitation: item.caseCitations[0],
        highlights: item["@search.highlights"],
      })),
    }

    return Response.json(data)
  } catch (error) {
    logError("Error searching cases", error)
    return Response.json({ error: "Failed searching data" }, { status: 500 })
  }
}
