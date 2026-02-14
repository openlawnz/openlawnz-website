import AzureSearchClient from './AzureSearchClient.js';

function sanitizeString(str) {
    str = str.replace(/[^a-z0-9áéíóúñü~" \.,_-]/gim, "");
    return str.trim();
}

/**
 * Verify Cloudflare Turnstile token
 * @param {string} token - The Turnstile token from the client
 * @param {string} ip - The client's IP address (optional but recommended)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function verifyTurnstileToken(token, ip) {
    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    
    if (!secretKey) {
        // If no secret key configured, skip verification (for development)
        console.warn('TURNSTILE_SECRET_KEY not configured, skipping verification');
        return { success: true };
    }

    if (!token) {
        return { success: false, error: 'Missing Turnstile token' };
    }

    try {
        const formData = new URLSearchParams();
        formData.append('secret', secretKey);
        formData.append('response', token);
        if (ip) {
            formData.append('remoteip', ip);
        }

        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        const result = await response.json();
        
        if (!result.success) {
            console.warn('Turnstile verification failed:', result['error-codes']);
            return { success: false, error: 'Verification failed' };
        }

        return { success: true };
    } catch (error) {
        console.error('Turnstile verification error:', error);
        return { success: false, error: 'Verification service error' };
    }
}

export default async (request, context) => {
    // Verify Turnstile token if configured
    const turnstileToken = request.headers.get('X-Turnstile-Token');
    const clientIP = context.ip || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    
    const verification = await verifyTurnstileToken(turnstileToken, clientIP);
    if (!verification.success) {
        return Response.json(
            { error: 'Bot verification failed', message: verification.error },
            { status: 403 }
        );
    }

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
