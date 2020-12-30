const fetch = require("node-fetch")

exports.handler = async function(event) {

  const caseCitation = event.queryStringParameters.case
  const { API_SECRET, API_URL } = process.env
  try {
    const caseFields = `
      case {
        caseName
        id
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

    const res = await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      body: JSON.stringify({query: query}),
    
      headers: {
        "x-api-key": API_SECRET,
        "Content-Type": "application/json"
      }
    })

    const data = await res.json()

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (error) {
    return {
      statusCode: error.statusCode,
      body: JSON.stringify(error.statusText)
    }
  }
}
