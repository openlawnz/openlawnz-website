const REQUEST_TIMEOUT_MS = 8000
const CASE_CITATION_PATTERN = /^[a-z0-9-]{1,120}$/i
const IS_PRODUCTION = process.env.NODE_ENV === "production" || process.env.CONTEXT === "production"

function buildErrorResponse(status, message) {
  return Response.json({ error: message }, { status })
}

async function fetchWithTimeout(url, options, timeoutMs = REQUEST_TIMEOUT_MS) {
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

export default async (request) => {
  const url = new URL(request.url)
  const caseCitation = url.searchParams.get("case") || ""

  if (!caseCitation) {
    return buildErrorResponse(400, "Missing required parameter: case")
  }

  if (!CASE_CITATION_PATTERN.test(caseCitation)) {
    return buildErrorResponse(400, "Invalid case parameter")
  }

  const { API_SECRET, API_URL } = process.env
  if (!API_SECRET || !API_URL) {
    return buildErrorResponse(500, "Service misconfigured")
  }

  try {
    const caseFields = `
      case {
        caseName
        id
        parsersVersion
        caseCitations {
          citation
        }
        casesCitedsByCaseCited {
          caseByCaseOrigin {
            caseName
            caseCitations {
              id
            }
          }
        }
        casesCitedsByCaseOrigin {
          caseByCaseCited {
            caseName
            caseCitations {
              id
            }
          }
        }
        legislationToCases {
          section
          legislationId
          legislation {
            title
            link
          }
        }
      }
    `

    const query = `
      query CaseByCitation($id: String!) {
        caseCitation(id: $id) {
          ${caseFields}
        }
      }
    `

    const res = await fetchWithTimeout(`${API_URL}/graphql`, {
      method: "POST",
      body: JSON.stringify({
        query,
        variables: { id: caseCitation },
      }),
      headers: {
        "x-api-key": API_SECRET,
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      return buildErrorResponse(502, "Upstream API request failed")
    }

    const data = await res.json()
    if (data.errors) {
      logError("GraphQL response contained errors", data.errors)
      return buildErrorResponse(502, "Upstream API request failed")
    }

    return Response.json(data)
  } catch (error) {
    logError("Failed fetching data", error)
    return buildErrorResponse(500, "Failed fetching data")
  }
}
