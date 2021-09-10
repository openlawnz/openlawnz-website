const path = require('path')

module.exports = {
  siteMetadata: {
    title: `OpenLaw NZ`,
    description: `New Free Legal Research Platform for New Zealand`,
    author: `OpenLaw NZ`,
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-eslint',
      options: {
        test: /\.js$|\.jsx$/,
        exclude: /(node_modules|.cache|public)/,
        stages: ['develop'],
        options: {
          emitWarning: true,
          failOnError: false
        }
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
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        //trackingId: `ADD YOUR TRACKING ID HERE`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `OpenLaw NZ`,
        short_name: `OpenLaw NZ`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/logo-small.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
   
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
        },
        extensions: ["js", "jsx", "css", "scss", "svg", "png", "json", "jpg"]
      }
    },
    "gatsby-plugin-use-query-params",
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,

    {
      resolve: `gatsby-plugin-netlify-cms`,
      options: {
        manualInit: true,
        modulePath: `${__dirname}/src/cms/cms.js`,
      },
    },
  ],
}

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})