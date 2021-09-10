const path = require(`path`)
// const { createFilePath } = require(`gatsby-source-filesystem`)

// exports.createPages = async ({ graphql, actions, reporter }) => {
//   const { createPage } = actions
// }

// exports.onCreateNode = ({ node, actions, getNode }) => {
// }

// exports.createSchemaCustomization = ({ actions }) => {
// }

exports.onCreatePage = ({ page, actions }) => {
  const { createPage } = actions
  if (page.path.match(/^\/case/)) {
    page.matchPath = "/case/*"

    createPage(page)
  }
} 