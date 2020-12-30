import React from "react"
import Logo from "../images/global/logo.svg"
import { Link } from "gatsby"

import "../css/Header.css"


const Header = () => (
    <header>
        <div className="inner">
            <div>
                <Link to="/"><img src={Logo} alt="OpenLaw NZ logo" /></Link>
            </div>
            <nav>
                <Link to="/our-mission" activeClassName="active">Our Mission</Link>
                <Link to="/how-to-use" activeClassName="active">How to Use</Link>
                <Link to="/blog" activeClassName="active">Blog</Link>
            </nav>
            <form method="get" action="search">
                <div id="search-simple">
                    <label className="show-for-sr" htmlFor="top-search">Search 30k cases</label>
                    <input type="search" placeholder="Search 30k cases" name="q" id="top-search" required />
                    <button type="submit">
                        Search
                    </button>
                </div>
                <div id="search-options">
                    <Link to="/search2">Advanced Search</Link>
                </div>
            </form>
        </div>
    </header>
)

export default Header