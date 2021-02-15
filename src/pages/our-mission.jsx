import React from "react"
import { graphql } from "gatsby"
import HeroSmall from "../components/HeroSmall"
import Layout from "../components/Layout"
import SEO from "../components/seo"

import "../css/Index.css"

import AndrewImage from "../images/our-mission/andrew-easterbrook.jpg"
import WillImage from "../images/our-mission/william-parry.jpg"

const OurMission = ({ data }) => {
    const missionItems = data.allMissionJson.nodes.sort((a, b) => {
        return +new Date(b.data) - +new Date(a.data)
    })
    return (
        <Layout>
            <SEO
                title="Our Mission"
                description="OpenLaw NZ is an open-source legal data platform. Our goal is to improve the accessibility of case law 
            and other legal information in New Zealand. We want to make it easier for all New Zealanders to understand law. "
            />
            <HeroSmall title="Our Mission" />
            <div className="inner">
                <div className="body-wrap content-page right-on-top">
                    <div className="body-left">
                        {
                            missionItems.map(({ title, data, text }, idx) => (
                                <article id={title} className="content-section" key={idx}>
                                    <h2 className="body-title">{title}</h2>
                                    <p className="blog-meta">{data}</p>
                                    {
                                        text.map(({ content_html }, idx) => (
                                            <p key={idx} dangerouslySetInnerHTML={{ __html: content_html }} />
                                        ))
                                    }
                                </article>
                            ))
                        }

                        <div id="directors" className="content-section">
                            <h2 className="body-title">Directors</h2>
                            <div className="directors-segments">
                                <div>
                                    <img src={AndrewImage} alt="Andrew Easterbrook" />
                                    <h3>Andrew Easterbrook, CEO</h3>
                                    <p>
                                        Andrew is a lawyer, and has worked in technology law, civil litigation and
                                        family law since 2009. He has been a Member of the Auckland District Law Society
                                        Technology & Law Committee since 2012, and is experienced in web and software
                                        development. Andrew went to university at Victoria, Wellington, and now lives in
                                        Whangarei.
                                </p>
                                </div>
                                <div>
                                    <img src={WillImage} alt="William Parry" />
                                    <h3>William Parry, CTO</h3>
                                    <p>
                                        William brings 15 years of tech experience across enterprise, advertising and
                                        small businesses including 8 years working with open data in projects and
                                        hackathons. He has run community coding classes and is passionate about
                                        empowering disadvantaged people with technology. William went to university at
                                        Victoria, Wellington, and now lives in Sydney.
                                </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="body-right">
                        <div className="on-this-page">
                            <h2>On this page</h2>
                            <nav>
                                <ul>
                                    {
                                        missionItems.map(({ title }, idx) => (
                                            <li key={idx}>
                                                <a href={`#${title}`}>
                                                    {title}
                                                </a>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default OurMission

export const query = graphql`
    query StaticQuery {
        allMissionJson {
            nodes {
                title
                text {
                    content_html
                }
            }
        }
    }
`