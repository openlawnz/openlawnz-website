export default async (request, context) => {
  console.log('API function invoked')
  console.log('Request URL:', request.url)
  console.log('Request method:', request.method)
  
  const url = new URL(request.url)
  const caseCitation = url.searchParams.get('case')
  
  console.log('Case citation parameter:', caseCitation)
  
  if (!caseCitation) {
    console.warn('Missing case parameter in request')
    return Response.json(
      { error: 'Missing required parameter: case' },
      { status: 400 }
    )
  }

  const { API_SECRET, API_URL } = context.env
  
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
      query MyQuery { 
        caseCitation(id: "${caseCitation}") {
          ${caseFields} 
        } 
      }` 

    console.log('Preparing GraphQL request to:', `${API_URL}/graphql`)
    console.log('Query prepared for case citation:', caseCitation)

    const fetchStartTime = Date.now()
    const res = await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      body: JSON.stringify({ query }),
      headers: {
        "x-api-key": API_SECRET,
        "Content-Type": "application/json"
      }
    })
    const fetchDuration = Date.now() - fetchStartTime

    console.log('GraphQL request completed')
    console.log('Response status:', res.status, res.statusText)
    console.log('Response time:', fetchDuration, 'ms')
    console.log('Response headers:', Object.fromEntries(res.headers.entries()))

    if (!res.ok) {
      const errorText = await res.text()
      console.error('API request failed with status:', res.status)
      console.error('Error response body:', errorText)
      
      return Response.json(
        { 
          error: 'API request failed', 
          status: res.status,
          statusText: res.statusText,
          details: errorText
        },
        { status: 502 }
      )
    }

    console.log('Parsing JSON response')
    const data = await res.json()
    console.log('Response parsed successfully')
    console.log('Response data keys:', Object.keys(data))
    
    if (data.errors) {
      console.error('GraphQL errors in response:', JSON.stringify(data.errors, null, 2))
    }
    
    console.log('Returning successful response')
    return Response.json(data)
    
  } catch (error) {
    console.error('=== ERROR CAUGHT ===')
    console.error('Error type:', error.constructor.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    if (error.cause) {
      console.error('Error cause:', error.cause)
    }
    
    return Response.json(
      { 
        error: 'Failed fetching data', 
        message: error.message,
        type: error.constructor.name,
        stack: error.stack
      },
      { status: 500 }
    )
  }
}
