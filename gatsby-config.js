const path = require('path')

module.exports = {
  siteMetadata: {
    title: `OpenLaw NZ`,
    description: `New Free Legal Research Platform for New Zealand`,
    author: `OpenLaw NZ`,
    siteUrl: `https://openlaw.nz`
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-eslint',
      options: {
        stages: ["develop"],
        rulePaths: [`${process.cwd()}/node_modules/gatsby/dist/utils/eslint-rules`],
        extensions: ["js", "jsx", "ts", "tsx"],
        exclude: ["node_modules", "bower_components", ".cache", "public"],
      }
    },
    "gatsby-transformer-json",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-147450154-1`,
      },
    },
    {
      resolve: `gatsby-plugin-alias-imports`,
      options: {
        alias: {
          "@/components": path.resolve(__dirname, "src/components"),
          "@/css": path.resolve(__dirname, "src/css"),
          "@/cms": path.resolve(__dirname, "src/cms"),
          "@/public": path.resolve(__dirname, "src/public"),
          "@/static": path.resolve(__dirname, "src/static"),
          "@/images": path.resolve(__dirname, "src/images"),
          "@/containers": path.resolve(__dirname, "src/containers"),
          "@/helpers": path.resolve(__dirname, "src/helpers"),
        },
        extensions: ["js", "jsx", "css", "scss", "svg", "png", "json", "jpg"]
      }
    },
    "gatsby-plugin-use-query-params",
    `gatsby-plugin-sitemap`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,

  ],
}

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    infrastructureLogging: {
      level: 'error',
    },
  })
}

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})