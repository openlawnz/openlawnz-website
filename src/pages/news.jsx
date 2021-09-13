import { graphql } from "gatsby"

import SEO from "@/components/seo"
import NewsContainer from "@/containers/news/news"

const NewsPage = ({data}) => {

    const newsItems =  data.allNewsJson.nodes.sort((a,b) => {
        return +new Date(b.data) - +new Date(a.data)
    })

    return (
        <>
            <SEO
                    title="News" 
                    description="News and updates about OpenLaw NZ"
                />
            <NewsContainer newsItems={newsItems}/>
        </>
    )
}

export default NewsPage

export const query = graphql`
    query MyQuery {
        allNewsJson {
            nodes {
                title
                text {
                    content_html
                }
                data(formatString: "YYYY-MM-DD")
            }
        }
    }
`