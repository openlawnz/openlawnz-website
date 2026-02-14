const REQUEST_TIMEOUT_MS = 8000

class AzureSearchClient {
  constructor(searchServiceName, queryKey, indexName) {
    this.searchServiceName = searchServiceName
    this.queryKey = queryKey
    this.indexName = indexName
    this.apiVersion = "2019-05-06"
  }

  getSearchUrl(searchTerm, offset) {
    const url = new URL(`https://${this.searchServiceName}.search.windows.net/indexes/${this.indexName}/docs`)

    url.searchParams.set("api-version", this.apiVersion)
    url.searchParams.set("$select", "fileKey,caseCitations,caseNames,caseDate")
    url.searchParams.set("highlight", "caseText-1")
    url.searchParams.set("$top", "10")
    url.searchParams.set("$skip", String(offset))
    url.searchParams.set("$count", "true")
    url.searchParams.set("search", searchTerm)
    url.searchParams.set("searchMode", "all")
    url.searchParams.set("queryType", "full")

    return url.toString()
  }

  static async request(url, method, apiKey, bodyJson = null, timeoutMs = REQUEST_TIMEOUT_MS) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    const headers = {
      "content-type": "application/json",
      "api-key": apiKey,
    }

    const init =
      bodyJson === null
        ? {
            method,
            headers,
            signal: controller.signal,
          }
        : {
            method,
            headers,
            body: JSON.stringify(bodyJson),
            signal: controller.signal,
          }

    try {
      return await fetch(url, init)
    } finally {
      clearTimeout(timeoutId)
    }
  }

  static throwOnHttpError(response) {
    const statusCode = response.status
    if (statusCode >= 300) {
      throw new Error(`Failure in request. HTTP Status was ${statusCode}`)
    }
  }

  async queryAsync(searchTerm, offset, court, caseLocation) {
    let query = searchTerm

    if (caseLocation !== "") {
      query = `${query} caseLocation:${caseLocation}`
    }

    if (court !== "") {
      query = `${query} court:"${court}"`
    }

    const endpoint = this.getSearchUrl(query, offset)
    const response = await AzureSearchClient.request(endpoint, "GET", this.queryKey)
    AzureSearchClient.throwOnHttpError(response)

    return response
  }
}

export default AzureSearchClient
