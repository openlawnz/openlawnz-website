import React from "react"
import "./hero.css"

const HeroSmall = ({title}) => (
    <div className="hero">
        <div className="inner">
            <h1>
               {title}
            </h1>
        </div>
    </div>
)

export default HeroSmall