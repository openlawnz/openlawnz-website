// From https://github.com/Azure-Samples/azure-search-javascript-samples/blob/master/quickstart/AzureSearchClient.js

class AzureSearchClient {
    constructor(searchServiceName, adminKey, queryKey, indexName) {
        this.searchServiceName = searchServiceName;
        this.adminKey = adminKey;
        // The query key is used for read-only requests and so can be distributed with less risk of abuse.
        this.queryKey = queryKey;
        this.indexName = indexName;
        this.apiVersion = '2019-05-06';
    }

    getIndexUrl() { return `https://${this.searchServiceName}.search.windows.net/indexes/${this.indexName}?api-version=${this.apiVersion}`; }
    
    getSearchUrl(searchTerm, offset) { return `https://${this.searchServiceName}.search.windows.net/indexes/${this.indexName}/docs?api-version=${this.apiVersion}&$select=fileKey,caseCitations,caseNames,caseDate&highlight=caseText-1&$top=10&$skip=${offset}&$count=true&search=${searchTerm}&searchMode=all&queryType=full`; }
    
    static async request(url, method, apiKey, bodyJson = null) {
        // Uncomment the following for request details:
        /*
        console.log(`\n${method} ${url}`);
        console.log(`\nKey ${apiKey}`);
        if (bodyJson !== null) {
            console.log(`\ncontent: ${JSON.stringify(bodyJson, null, 4)}`);
        }
        */

        const headers = {
            'content-type' : 'application/json',
            'api-key' : apiKey
        };
        const init = bodyJson === null ?
            { 
                method, 
                headers
            }
            : 
            {
                method, 
                headers,
                body : JSON.stringify(bodyJson)
            };
        return fetch(url, init);
    }

    static throwOnHttpError(response) {
        const statusCode = response.status;
        if (statusCode >= 300){
            console.log(`Request failed: ${JSON.stringify(response, null, 4)}`);
            throw new Error(`Failure in request. HTTP Status was ${statusCode}`);
        }
    }

    async indexExistsAsync() { 
        console.log("\n Checking if index exists...");
        const endpoint = this.getIndexUrl();
        const response = await AzureSearchClient.request(endpoint, "GET", this.adminKey);
        // Success has a few likely status codes: 200 or 204 (No Content), but accept all in 200 range...
        const exists = response.status >= 200 && response.status < 300;
        return exists;
    }
    
    async queryAsync(searchTerm, offset, court, caseLocation) {
        console.log(`\n Querying... Term: ${searchTerm}, Offset: ${offset}, Case Location ${caseLocation}`)
            
        if(caseLocation !== '') searchTerm = searchTerm + ` caseLocation:${caseLocation}`
        if(court !== '') searchTerm = searchTerm + ` court:"${court}"`
        
        const endpoint = this.getSearchUrl(searchTerm, offset);
        
        const response = await AzureSearchClient.request(endpoint, "GET", this.queryKey);
        AzureSearchClient.throwOnHttpError(response);
        return response;
    }
}

export default AzureSearchClient;