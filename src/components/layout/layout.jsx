import "@/css/app.css"

import PropTypes from "prop-types"

import Footer from "../footer/footer"
import Header from "../header/header"

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
