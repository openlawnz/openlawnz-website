import { http, HttpResponse } from "msw"

import { findMockCaseById, queryMockSearch } from "./searchMockService"

export const handlers = [
  http.get("/search-cases", ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get("q")

    if (!q) {
      return HttpResponse.json({ error: "Missing required parameter: q" }, { status: 400 })
    }

    const p = url.searchParams.get("p") || ""
    const court = url.searchParams.get("court") || ""
    const location = url.searchParams.get("location") || ""

    return HttpResponse.json(queryMockSearch(q, p, court, location))
  }),

  http.get("/api", ({ request }) => {
    const url = new URL(request.url)
    const caseId = url.searchParams.get("case")

    if (!caseId) {
      return HttpResponse.json({ error: "Missing required parameter: case" }, { status: 400 })
    }

    const mockCase = findMockCaseById(caseId)

    if (!mockCase) {
      return HttpResponse.json({ error: "Case not found" }, { status: 404 })
    }

    return HttpResponse.json({
      data: {
        caseCitation: {
          case: {
            caseName: mockCase.caseName,
            id: mockCase.id,
            parsersVersion: "1.0.0-mock",
            caseCitations: [{ citation: mockCase.citation }],
            casesCitedsByCaseCited: [],
            casesCitedsByCaseOrigin: [],
            legislationToCases: [],
          },
        },
      },
    })
  }),
]
