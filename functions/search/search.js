const AzureSearchClient = require('./AzureSearchClient.js');

function sanitizeString(str) {
    str = str.replace(/[^a-z0-9áéíóúñü~" \.,_-]/gim, "");
    return str.trim();
}

exports.handler = async(event) => {

    //const stage = event.requestContext.stage;
    //Request should be sent through the correct redirect

    if (event.queryStringParameters && event.queryStringParameters.q) {
        const client = new AzureSearchClient(
            process.env.SERVICE_NAME,
            process.env.ADMIN_KEY,
            process.env.QUERY_KEY,
            process.env.INDEX_NAME + '-' + process.env.SEARCH_ENV
        );

        try {
            const result = await client.queryAsync(`${sanitizeString(event.queryStringParameters.q)}`, `${sanitizeString(event.queryStringParameters.p)}`, `${sanitizeString(event.queryStringParameters.court || '')}`, `${sanitizeString(event.queryStringParameters.location || '')}`).then(r => r.json());
            return {
                statusCode: 200,
                body: JSON.stringify({
                    count: result['@odata.count'],
                    results: result.value.map(x => {
                        return {
                            caseName: x.caseNames[0],
                            caseDate: x.caseDate,
                            caseCitation: x.caseCitations[0],
                            highlights: x["@search.highlights"]
                        }
                    })
                })
            };


        }
        catch (ex) {

            return {
                statusCode: 500,
                body: "Error"
            }

        }

    }
    else {
        return {
            statusCode: 500,
            body: "Error"
        }
    }

};
