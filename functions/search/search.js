import AzureSearchClient from './AzureSearchClient.js';

function sanitizeString(str) {
    str = str.replace(/[^a-z0-9áéíóúñü~" \.,_-]/gim, "");
    return str.trim();
}

export default async (request, context) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q')

    if (!q) {
        return Response.json(
            { error: 'Missing required parameter: q' },
            { status: 400 }
        )
    }

    const { SERVICE_NAME, ADMIN_KEY, QUERY_KEY, INDEX_NAME, SEARCH_ENV } = process.env

    const client = new AzureSearchClient(
        SERVICE_NAME,
        ADMIN_KEY,
        QUERY_KEY,
        `${INDEX_NAME}-${SEARCH_ENV}`
    );

    try {
        const p = url.searchParams.get('p') || ''
        const court = url.searchParams.get('court') || ''
        const location = url.searchParams.get('location') || ''

        const result = await client
            .queryAsync(
                sanitizeString(q),
                sanitizeString(p),
                sanitizeString(court),
                sanitizeString(location)
            )
            .then(r => r.json());

        const data = {
            count: result['@odata.count'],
            results: result.value.map(x => ({
                caseName: x.caseNames[0],
                caseDate: x.caseDate,
                caseCitation: x.caseCitations[0],
                highlights: x["@search.highlights"]
            }))
        };

        return Response.json(data);

    } catch (error) {
        console.error('Error searching cases:', error);
        return Response.json(
            { error: 'Failed searching data', message: error.message },
            { status: 500 }
        );
    }
};
