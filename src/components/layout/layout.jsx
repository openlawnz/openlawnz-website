import React from "react"
import PropTypes from "prop-types"

import Header from "../header/header"
import Footer from "../footer/footer"

import "@/css/App.css"

const Layout = ({ children }) => {
  return (
    <>
      <div>
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
