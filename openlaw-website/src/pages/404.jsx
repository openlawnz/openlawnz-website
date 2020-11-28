import React from "react"
import Layout from "../components/Layout"
import { graphql } from "gatsby"

const NotFoundPage = ({ data }) => {
  const siteTitle = data.site.siteMetadata.title
  return (
    <Layout>
        404 | {siteTitle}
    </Layout>
  )
}

export default NotFoundPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
