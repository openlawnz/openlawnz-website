import "./header.css"

import { Link, navigate } from "gatsby"
import { useRef } from "react"

import Logo from "@/images/global/logo.svg"

const Header = () => {
  const searchInputRef = useRef(null)

  const handleSubmit = (event) => {
    event.preventDefault()

    const submittedQuery = searchInputRef.current?.value?.trim() || ""
    if (!submittedQuery) {
      return
    }

    const params = new URLSearchParams({ q: submittedQuery })
    navigate(`/search?${params.toString()}`)
  }

  return (
    <header>
      <div className="inner">
        <div>
          <Link to="/">
            <img src={Logo} alt="OpenLaw NZ logo" />
          </Link>
        </div>
        <nav>
          <Link to="/our-mission" activeClassName="active">
            Our Mission
          </Link>
          <Link to="/how-to-use" activeClassName="active">
            How to Use
          </Link>
        </nav>
        <form method="get" onSubmit={handleSubmit}>
          <div id="search-simple">
            <label className="show-for-sr" htmlFor="top-search">
              Search 47k cases
            </label>
            <input
              type="search"
              placeholder="Search 47k cases"
              name="q"
              id="top-search"
              ref={searchInputRef}
              required
            />
            <button type="submit">Search</button>
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
