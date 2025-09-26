import { graphql } from "gatsby"

import SEO from "@/components/seo"
import OurMissionContainer from "@/containers/our-mission/our-mission"

const OurMission = ({data}) => {
    const pageContext = data.allMissionJson.nodes[0]

    return (
        <>
            <SEO
                title={pageContext.title}
                description="OpenLaw NZ is an open-source legal data platform. Our goal is to improve the accessibility of case law 
            and other legal information in New Zealand. We want to make it easier for all New Zealanders to understand law. "
            />
            <OurMissionContainer {...pageContext}/>
        </>
    )
}

export default OurMission

export const query = graphql`
    query StaticQuery {
        allMissionJson {
            nodes {
              title
              modules {
                title
                type
                content {
                  content_html
                  title
                  name
                }
              }
            }
        }
    }
`