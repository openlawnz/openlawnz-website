import React from "react"
import { Link } from "gatsby"
import toSlug from "@/helpers/to-slug"
import "./side-nav.css"

const SideNav = ({ heading, items}) => {
    return (
        <div className="body-right">
            <div className="on-this-page">
                <h2>{heading}</h2>
                <ul>
                    {
                        items.map(({address, text}, idx) => (
                            <li key={idx}>
                                <Link to={toSlug(address)}>
                                    {text}
                                </Link>
                            </li>
                         ))
                    }
                </ul>
            </div>
        </div>
    )
}

export default SideNav