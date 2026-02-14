import "./search.css"

import { Link, navigate } from "gatsby"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import ReactPaginate from "react-paginate"
import sanitizeHtml from "sanitize-html"
import { NumberParam, StringParam, useQueryParam } from "use-query-params"
import { Helmet } from "react-helmet"

import HeroSmall from "@/components/hero/hero-small"
import Layout from "@/components/layout/layout"
import SEO from "@/components/seo"

// Turnstile site key - this is public and safe to expose.
// In development, fall back to Cloudflare's "always passes" test key so the
// widget renders visually but never blocks.
// https://developers.cloudflare.com/turnstile/troubleshooting/testing/
//
// Webpack DefinePlugin replaces process.env.NODE_ENV with a string literal at
// build time, so the ternaries below become dead code that Terser strips out
// of production bundles.
const TURNSTILE_SITE_KEY = process.env.GATSBY_TURNSTILE_SITE_KEY
  || (process.env.NODE_ENV !== "production" ? "1x00000000000000000000AA" : "")
const IS_TURNSTILE_ENABLED = Boolean(TURNSTILE_SITE_KEY)

const SANITIZE_SNIPPET_OPTIONS = {
  allowedTags: ["em"],
  allowedAttributes: {},
}

const SNIPPET_MAX_LENGTH = 300

/**
 * Truncate an HTML string at a maximum *visible text* length without breaking
 * tags.  Only handles simple markup (e.g. <em>…</em> highlight wrappers).
 */
function truncateSnippetHtml(html, maxLength) {
  if (!html) return html

  let visibleLength = 0
  let result = ""
  let i = 0

  while (i < html.length && visibleLength < maxLength) {
    if (html[i] === "<") {
      // Copy the entire tag without counting towards visible length
      const tagEnd = html.indexOf(">", i)
      if (tagEnd === -1) break
      result += html.substring(i, tagEnd + 1)
      i = tagEnd + 1
    } else {
      result += html[i]
      visibleLength += 1
      i += 1
    }
  }

  if (visibleLength >= maxLength && i < html.length) {
    result += "\u2026" // ellipsis
  }

  // Close any unclosed <em> tags
  const openCount = (result.match(/<em>/gi) || []).length
  const closeCount = (result.match(/<\/em>/gi) || []).length
  for (let j = 0; j < openCount - closeCount; j++) {
    result += "</em>"
  }

  return result
}

const AdvancedSearchForm = memo(function AdvancedSearchForm({ query, court, location, onSearch, heading, horizontal }) {
  const [localQuery, setLocalQuery] = useState(query ?? "")
  const [localCourt, setLocalCourt] = useState(court ?? "")
  const [localLocation, setLocalLocation] = useState(location ?? "")

  useEffect(() => { setLocalQuery(query ?? "") }, [query])
  useEffect(() => { setLocalCourt(court ?? "") }, [court])
  useEffect(() => { setLocalLocation(location ?? "") }, [location])

  const handleSubmit = (event) => {
    event.preventDefault()
    onSearch({ query: localQuery, court: localCourt, location: localLocation })
  }

  return (
    <>
      <h2>{heading}</h2>
      <form
        onSubmit={handleSubmit}
        className={`advanced-search-form${horizontal ? " advanced-search-form-horizontal" : ""}`}
      >
        <div className="advanced-search-field">
          <label htmlFor="q">Search Term</label>
          <input
            type="text"
            name="q"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            id="q-advanced"
          />
        </div>
        <div className="advanced-search-field">
          <label htmlFor="court">Court</label>
          <select name="court" value={localCourt} onChange={(e) => setLocalCourt(e.target.value)} id="court">
            <option></option>
            <option>Court of Appeal</option>
            <option>District Court</option>
            <option>High Court</option>
            <option>Supreme Court</option>
          </select>
        </div>
        <div className="advanced-search-field">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            name="location"
            id="location"
            value={localLocation}
            onChange={(e) => setLocalLocation(e.target.value)}
          />
        </div>
        <button className="advanced-search-button">Search</button>
      </form>

      <h2 id="search-tips-header">Search tips</h2>
      <ul id="search-tips">
        <li>
          Search for phrases using quotes <code>""</code>.
        </li>
        <li>Combine terms or phases with AND, OR, and NOT.</li>
        <li>
          Default connector is OR: <code>auckland helicopter</code> searches for{" "}
          <code>auckland OR helicopter</code>.
        </li>
        <li>
          Make a search term fuzzy by adding <code>~</code> at the end: <code>"rescu~"</code>.
        </li>
        <li>
          Proximity search by adding <code>~</code> and a number after a phrase.
        </li>
        <li>
          <code>"pre report"~2</code> will find "pre-sentence report".
        </li>
        <li>
          <a href="/how-to-use#using-search">See more tips</a>
        </li>
      </ul>
    </>
  )
})

const SearchPageContainer = () => {
  const [query] = useQueryParam("q", StringParam)
  const [page, setPage] = useQueryParam("p", NumberParam)
  const [location] = useQueryParam("location", StringParam)
  const [court] = useQueryParam("court", StringParam)

  const [cases, setCases] = useState({})
  const [isLoadingCases, setIsLoadingCases] = useState(true)
  const [hasLoadedCases, setHasLoadedCases] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState(null)
  const [turnstileError, setTurnstileError] = useState(null)
  const turnstileRef = useRef(null)
  const turnstileWidgetIdRef = useRef(null)

  const safePage = Number.isInteger(page) && page >= 0 ? page : 0
  const totalCount = Number.isFinite(cases?.count) ? cases.count : 0
  const pageCount = totalCount > 0 ? Math.ceil(totalCount / 10) : 0
  const currentPage = pageCount > 0 ? Math.min(safePage, pageCount - 1) : 0
  const isWaitingForTurnstile = Boolean(IS_TURNSTILE_ENABLED && !turnstileToken)
  const shouldShowTurnstileWaitState = isWaitingForTurnstile && !hasLoadedCases

  // Callback when Turnstile completes verification
  const onTurnstileCallback = useCallback((token) => {
    setTurnstileToken(token)
    setTurnstileError(null)
  }, [])

  // Callback when Turnstile expires (token needs refresh)
  const onTurnstileExpired = useCallback(() => {
    setTurnstileToken(null)
    if (!IS_TURNSTILE_ENABLED || !window.turnstile || turnstileWidgetIdRef.current === null) {
      return
    }

    try {
      window.turnstile.reset(turnstileWidgetIdRef.current)
    } catch {
      return
    }
  }, [])

  // Callback on Turnstile error — in dev, bypass so searches aren't blocked.
  // The process.env.NODE_ENV check is replaced at build time by Webpack's
  // DefinePlugin, so the dev branch is dead-code-eliminated in production.
  const onTurnstileError = useCallback(() => {
    if (process.env.NODE_ENV !== "production") {
      // Turnstile can't reach Cloudflare from dev containers; treat as passed
      setTurnstileToken("DEV_BYPASS")
      setTurnstileError(null)
      return
    }
    setTurnstileError("Verification failed. Please refresh the page.")
    setTurnstileToken(null)
  }, [])

  const renderTurnstile = useCallback(() => {
    if (!IS_TURNSTILE_ENABLED || !turnstileRef.current || !window.turnstile || turnstileWidgetIdRef.current !== null) {
      return false
    }

    try {
      turnstileWidgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: onTurnstileCallback,
        "expired-callback": onTurnstileExpired,
        "error-callback": onTurnstileError,
        theme: "light",
      })
      return true
    } catch {
      return false
    }
  }, [onTurnstileCallback, onTurnstileExpired, onTurnstileError])

  useEffect(() => {
    if (!IS_TURNSTILE_ENABLED) {
      return
    }

    let attempts = 0
    const maxAttempts = 30
    let timeoutId = null

    const tryRenderTurnstile = () => {
      if (renderTurnstile()) {
        return
      }

      attempts += 1
      if (attempts < maxAttempts) {
        timeoutId = window.setTimeout(tryRenderTurnstile, 150)
      }
    }

    tryRenderTurnstile()

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }

      if (window.turnstile && turnstileWidgetIdRef.current !== null) {
        try {
          window.turnstile.remove(turnstileWidgetIdRef.current)
        } catch {
          // no-op
        }
      }

      turnstileWidgetIdRef.current = null
      if (turnstileRef.current) {
        turnstileRef.current.innerHTML = ""
      }
    }
  }, [renderTurnstile])

  useEffect(() => {
    // Wait for Turnstile token if site key is configured
    if (isWaitingForTurnstile) {
      return
    }

    // Don't search when there's no query
    if (!query) {
      setCases({})
      setIsLoadingCases(false)
      setHasLoadedCases(true)
      return
    }

    const controller = new AbortController()
    let cancelled = false

    const loadCases = async () => {
      setIsLoadingCases(true)

      try {
        const headers = {}
        if (turnstileToken) {
          headers["X-Turnstile-Token"] = turnstileToken
        }

        const params = new URLSearchParams({
          q: query,
          p: String(safePage * 10),
          court: court || "",
          location: location || "",
        })
        const res = await fetch(`/search-cases?${params.toString()}`, {
          headers,
          signal: controller.signal,
        })

        if (cancelled) return

        if (res.status === 403) {
          setTurnstileError("Verification failed. Please refresh the page.")
          setCases({})
          setHasLoadedCases(true)
          return
        }

        const cases = await res.json()
        setCases(cases)
        setHasLoadedCases(true)
      } catch (error) {
        if (error.name !== "AbortError" && !cancelled) {
          setCases({})
          setHasLoadedCases(true)
        }
      } finally {
        if (!cancelled) {
          setIsLoadingCases(false)
        }
      }
    }

    loadCases()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [query, safePage, court, location, turnstileToken, isWaitingForTurnstile])

  // Reset Turnstile widget to get a fresh token
  const resetTurnstile = useCallback(() => {
    if (!IS_TURNSTILE_ENABLED) {
      return
    }

    setTurnstileToken(null)
    if (!TURNSTILE_SITE_KEY || !window.turnstile) {
      return
    }

    if (turnstileWidgetIdRef.current === null) {
      renderTurnstile()
      return
    }

    try {
      window.turnstile.reset(turnstileWidgetIdRef.current)
    } catch {
      return
    }
  }, [renderTurnstile])

  // Reset Turnstile when query params change (new search without full page refresh)
  useEffect(() => {
    resetTurnstile()
  }, [query, court, location, resetTurnstile])

  const handleAdvancedSearch = useCallback(({ query: q, court: c, location: l }) => {
    resetTurnstile()
    const params = new URLSearchParams({
      q: q || "",
      p: "0",
      court: c || "",
      location: l || "",
    })
    navigate(`/search?${params.toString()}`)
  }, [resetTurnstile])

  const hasQuery = Boolean(query)

  return (
    <Layout>
      <SEO
        title={hasQuery ? `Search - ${query}` : "Search"}
        description="OpenLaw NZ is an open-source legal data platform. Our goal is to improve the accessibility of case law 
                and other legal information in New Zealand. We want to make it easier for all New Zealanders to understand law. "
      />
      {/* Turnstile script loaded in head */}
      {IS_TURNSTILE_ENABLED && (
        <Helmet>
          <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
        </Helmet>
      )}
      <HeroSmall title={hasQuery ? query : "Search"} />

      {hasQuery ? (
        <div className="inner search-page">
          <div className="body-wrap right-on-top">
            <div className="body-left">
              <div id="search-body">
              {shouldShowTurnstileWaitState ? (
                <div className="search-results-state">Complete verification to view search results.</div>
              ) : isLoadingCases && !hasLoadedCases ? (
                <div className="search-results-state">Loading search results...</div>
              ) : (
                <>
                  <div className="search-results-card">
                    <table id="search-results-table">
                      <thead>
                        <tr>
                          <th className="case-name-column">Case name</th>
                          <th className="citation-column">Citation</th>
                          <th className="date-column">Date</th>
                          <th className="snippet-column">Snippet</th>
                        </tr>
                      </thead>
                      <tbody id="search-results-table-body">
                        {cases.count ? (
                          <>
                            {cases.results.map(({ caseName, caseCitation, caseDate, highlights }, idx) => {
                              const highlightText = highlights?.caseText?.[0] || ""
                              const snippetText = highlightText || "No snippet available."
                              const displayDate = caseDate?.substring ? caseDate.substring(0, 10) : "---"
                              return (
                                <tr key={idx}>
                                  <td className="case-name-column">
                                    <Link to={`/case/${caseCitation.id}`}>{caseName}</Link>
                                  </td>
                                  <td className="citation-column">{caseCitation.citation}</td>
                                  <td className="date-column">{displayDate}</td>
                                  <td
                                    className="snippet-column"
                                    dangerouslySetInnerHTML={{
                                      __html: sanitizeHtml(
                                        truncateSnippetHtml(snippetText, SNIPPET_MAX_LENGTH),
                                        SANITIZE_SNIPPET_OPTIONS
                                      ),
                                    }}
                                  />
                                </tr>
                              )
                            })}
                          </>
                        ) : (
                          <tr className="no-results-found">
                            <td>No results found</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {pageCount > 1 && (
                    <nav id="pagination">
                      <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        forcePage={currentPage}
                        onPageChange={(e) => {
                          setPage(e.selected)
                          // Turnstile tokens are single-use; reset after setting page so the
                          // new token arrival triggers a single fetch with the correct page.
                          resetTurnstile()
                        }}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"}
                      />
                    </nav>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="body-right">
            {/* Turnstile widget - Managed mode may show checkbox to some users */}
            {IS_TURNSTILE_ENABLED && (
              <div className="turnstile-container">
                <div ref={turnstileRef} className="turnstile-widget" />
                {turnstileError && <div className="turnstile-error">{turnstileError}</div>}
              </div>
            )}
            <div id="advanced-search" className="on-this-page">
              <AdvancedSearchForm
                query={query}
                court={court}
                location={location}
                onSearch={handleAdvancedSearch}
                heading="Advanced"
              />
            </div>
          </div>
        </div>
      </div>
      ) : (
        <div className="inner search-page">
          <div className="search-landing">
            <div id="advanced-search" className="advanced-search-landing">
              <AdvancedSearchForm
                query={query}
                court={court}
                location={location}
                onSearch={handleAdvancedSearch}
                heading="Advanced Search"
                horizontal
              />
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default SearchPageContainer
