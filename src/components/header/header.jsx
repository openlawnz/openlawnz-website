import "./header.css"

import { Link, navigate } from "gatsby"
import { useState } from "react"

import Logo from "@/images/global/logo.svg"


const Header = () => {
    const [ query, setQuery ] = useState('')
    return (
        <header>
            <div className="inner">
                <div>
                    <Link to="/"><img src={Logo} alt="OpenLaw NZ logo" /></Link>
                </div>
                <nav>
                    <Link to="/our-mission" activeClassName="active">Our Mission</Link>
                    <Link to="/how-to-use" activeClassName="active">How to Use</Link>
                    <Link to="/news" activeClassName="active">News</Link>
                </nav>
                <form method="get" onSubmit={(e) => {
                        e.preventDefault()

                        navigate(`/search?q=${query}`)
                    }}>
                    <div id="search-simple">
                        <label className="show-for-sr" htmlFor="top-search">Search 47k cases</label>
                        <input type="search" placeholder="Search 47k cases" name="q" id="top-search" value={query} onChange={e => setQuery(e.target.value)} required />
                        <button type="submit">
                            Search
                        </button>
                    </div>
                    <div id="search-options">
                        <Link to="/search">Advanced Search</Link>
                    </div>
                </form>
            </div>
        </header>
    )
}

export default Header