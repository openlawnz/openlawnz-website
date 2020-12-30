import React from "react"
import PropTypes from "prop-types"

import Header from "./Header"
import Footer from "./Footer"

import "../css/App.css"

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
