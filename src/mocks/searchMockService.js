const PAGE_SIZE = 10

const MOCK_CASES = [
  {
    id: "mock-2024-nzhc-1001",
    citation: "[2024] NZHC 1001",
    caseName: "Sample Case 001 [2024] NZHC 1001",
    caseDate: "2024-10-29",
    court: "High Court",
    location: "Wellington",
    caseText: "Dummy summary text for Sample Case 001. Placeholder content for local development and UI testing.",
  },
  {
    id: "mock-2023-nzhc-887",
    citation: "[2023] NZHC 887",
    caseName: "Sample Case 002 [2023] NZHC 887",
    caseDate: "2023-05-17",
    court: "High Court",
    location: "Auckland",
    caseText: "Dummy summary text for Sample Case 002. Placeholder content for local development and UI testing.",
  },
  {
    id: "mock-2022-nzhc-1552",
    citation: "[2022] NZHC 1552",
    caseName: "Sample Case 003 [2022] NZHC 1552",
    caseDate: "2022-12-23",
    court: "High Court",
    location: "Wellington",
    caseText: "Dummy summary text for Sample Case 003. Placeholder content for local development and UI testing.",
  },
  {
    id: "mock-2021-nzdc-3004",
    citation: "[2021] NZDC 3004",
    caseName: "Sample Case 004 [2021] NZDC 3004",
    caseDate: "2021-08-13",
    court: "District Court",
    location: "Whangarei",
    caseText: "Dummy summary text for Sample Case 004. Placeholder content for local development and UI testing.",
  },
  {
    id: "mock-2020-nzca-212",
    citation: "[2020] NZCA 212",
    caseName: "Sample Case 005 [2020] NZCA 212",
    caseDate: "2020-06-09",
    court: "Court of Appeal",
    location: "Wellington",
    caseText: "Dummy summary text for Sample Case 005. Placeholder content for local development and UI testing.",
  },
  {
    id: "mock-2024-nzsc-44",
    citation: "[2024] NZSC 44",
    caseName: "Sample Case 006 [2024] NZSC 44",
    caseDate: "2024-03-20",
    court: "Supreme Court",
    location: "Wellington",
    caseText: "Dummy summary text for Sample Case 006. Placeholder content for local development and UI testing.",
  },
  {
    id: "mock-2023-nzsc-11",
    citation: "[2023] NZSC 11",
    caseName: "Sample Case 007 [2023] NZSC 11",
    caseDate: "2023-07-20",
    court: "Supreme Court",
    location: "Wellington",
    caseText: "Dummy summary text for Sample Case 007. Placeholder content for local development and UI testing.",
  },
  {
    id: "mock-2022-nzhc-1499",
    citation: "[2022] NZHC 1499",
    caseName: "Sample Case 008 [2022] NZHC 1499",
    caseDate: "2022-06-30",
    court: "High Court",
    location: "Auckland",
    caseText: "Dummy summary text for Sample Case 008. Placeholder content for local development and UI testing.",
  },
  {
    id: "mock-2022-nzdc-4100",
    citation: "[2022] NZDC 4100",
    caseName: "Sample Case 009 [2022] NZDC 4100",
    caseDate: "2022-04-15",
    court: "District Court",
    location: "Hamilton",
    caseText: "Dummy summary text for Sample Case 009. Placeholder content for local development and UI testing.",
  },
  {
    id: "mock-2024-nzsc-9",
    citation: "[2024] NZSC 9",
    caseName: "Sample Case 010 [2024] NZSC 9",
    caseDate: "2024-02-21",
    court: "Supreme Court",
    location: "Wellington",
    caseText: "Dummy summary text for Sample Case 010. Placeholder content for local development and UI testing.",
  },
  {
    id: "mock-2021-nzca-311",
    citation: "[2021] NZCA 311",
    caseName: "Sample Case 011 [2021] NZCA 311",
    caseDate: "2021-09-03",
    court: "Court of Appeal",
    location: "Christchurch",
    caseText: "Dummy summary text for Sample Case 011. Placeholder content for local development and UI testing.",
  },
  {
    id: "mock-2020-nzdc-18022",
    citation: "[2020] NZDC 18022",
    caseName: "Sample Case 012 [2020] NZDC 18022",
    caseDate: "2020-10-05",
    court: "District Court",
    location: "Auckland",
    caseText: "Dummy summary text for Sample Case 012. Placeholder content for local development and UI testing.",
  },
  {
    id: "mock-2019-nzhc-875",
    citation: "[2019] NZHC 875",
    caseName: "Sample Case 013 [2019] NZHC 875",
    caseDate: "2019-05-11",
    court: "High Court",
    location: "Wellington",
    caseText: "Dummy summary text for Sample Case 013. Placeholder content for local development and UI testing.",
  },
  {
    id: "mock-2023-nzhc-1044",
    citation: "[2023] NZHC 1044",
    caseName: "Sample Case 014 [2023] NZHC 1044",
    caseDate: "2023-06-19",
    court: "High Court",
    location: "Wellington",
    caseText: "Dummy summary text for Sample Case 014. Placeholder content for local development and UI testing.",
  },
  {
    id: "mock-2022-nzdc-9001",
    citation: "[2022] NZDC 9001",
    caseName: "Sample Case 015 [2022] NZDC 9001",
    caseDate: "2022-08-12",
    court: "District Court",
    location: "Whangarei",
    caseText: "Dummy summary text for Sample Case 015. Placeholder content for local development and UI testing.",
  },
  {
    id: "mock-2021-nzsc-77",
    citation: "[2021] NZSC 77",
    caseName: "Sample Case 016 [2021] NZSC 77",
    caseDate: "2021-11-01",
    court: "Supreme Court",
    location: "Wellington",
    caseText: "Dummy summary text for Sample Case 016. Placeholder content for local development and UI testing.",
  },
]

function cleanFilterValue(value) {
  return (value || "").trim().replace(/^['"]+|['"]+$/g, "")
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function trimTokenPunctuation(term) {
  let start = 0
  let end = term.length
  const punctuation = "(),.;:[]"

  while (start < end && punctuation.includes(term[start])) {
    start += 1
  }

  while (end > start && punctuation.includes(term[end - 1])) {
    end -= 1
  }

  return term.substring(start, end)
}

function extractSearchTerms(rawQuery) {
  const query = (rawQuery || "").trim()
  if (!query || query === '""') {
    return []
  }

  const quotedTerms = []
  for (const match of query.matchAll(/"([^"]+)"/g)) {
    const phrase = match[1].trim().toLowerCase()
    if (phrase) {
      quotedTerms.push(phrase)
    }
  }

  const unquoted = query.replace(/"([^"]+)"/g, " ")
  const wordTerms = unquoted
    .split(/\s+/)
    .map((term) => term.replace(/~\d*$/, ""))
    .map((term) => trimTokenPunctuation(term))
    .filter((term) => term.length > 0)
    .filter((term) => !["AND", "OR", "NOT"].includes(term.toUpperCase()))
    .map((term) => term.toLowerCase())

  return [...quotedTerms, ...wordTerms]
}

function applyHighlights(caseText, terms) {
  if (!terms.length) {
    return caseText
  }

  let highlighted = caseText
  const uniqueTerms = terms.filter((term, index) => terms.indexOf(term) === index).sort((a, b) => b.length - a.length)
  uniqueTerms.forEach((term) => {
    const regex = new RegExp(`(${escapeRegExp(term)})`, "gi")
    highlighted = highlighted.replace(regex, "<em>$1</em>")
  })
  return highlighted
}

function makeSnippet(caseText, terms) {
  return applyHighlights(caseText, terms)
}

function parseOffset(rawOffset) {
  const offset = Number.parseInt(rawOffset, 10)
  if (Number.isNaN(offset) || offset < 0) {
    return 0
  }
  return offset
}

export function findMockCaseById(id) {
  return MOCK_CASES.find((c) => c.id === id) || null
}

function matchesSearch(caseRecord, terms) {
  if (!terms.length) {
    return true
  }

  const searchable = [
    caseRecord.caseName,
    caseRecord.citation,
    caseRecord.caseText,
    caseRecord.court,
    caseRecord.location,
  ]
    .join(" ")
    .toLowerCase()

  return terms.some((term) => searchable.includes(term))
}

export function queryMockSearch(rawQuery, rawOffset, rawCourt, rawLocation) {
  const searchTerms = extractSearchTerms(rawQuery)
  const courtFilter = cleanFilterValue(rawCourt).toLowerCase()
  const locationFilter = cleanFilterValue(rawLocation).toLowerCase()
  const offset = parseOffset(rawOffset)

  const matchesCourtAndLocation = (caseRecord) => {
    if (courtFilter && caseRecord.court.toLowerCase() !== courtFilter) {
      return false
    }

    if (locationFilter && !caseRecord.location.toLowerCase().includes(locationFilter)) {
      return false
    }

    return true
  }

  const filtered = MOCK_CASES.filter(
    (caseRecord) => matchesCourtAndLocation(caseRecord) && matchesSearch(caseRecord, searchTerms)
  )
  const fallbackFiltered = MOCK_CASES.filter((caseRecord) => matchesCourtAndLocation(caseRecord))
  const resultsForPage = filtered.length > 0 || !searchTerms.length ? filtered : fallbackFiltered

  const pagedResults = resultsForPage.slice(offset, offset + PAGE_SIZE)
  return {
    count: resultsForPage.length,
    results: pagedResults.map((caseRecord) => ({
      caseName: caseRecord.caseName,
      caseDate: caseRecord.caseDate,
      caseCitation: {
        id: caseRecord.id,
        citation: caseRecord.citation,
      },
      highlights: {
        caseText: [makeSnippet(caseRecord.caseText, searchTerms)],
      },
    })),
  }
}
