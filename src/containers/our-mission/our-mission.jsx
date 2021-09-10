import React from "react"
import HeroSmall from "@/components/hero/hero-small"

import AndrewImage from "@/images/our-mission/andrew-easterbrook.jpg"
import WillImage from "@/images/our-mission/william-parry.jpg"
import sanitizeHtml from 'sanitize-html'
import Layout from "@/components/layout/layout"
import SideNav from "@/components/side-nav/side-nav"
import toSlug from "@/helpers/to-slug"

export const OurMissionContainer = ({title, modules}) => { 
    return (
        <Layout>
            <HeroSmall title={title} />
            <div className="inner">
                <div className="body-wrap content-page right-on-top">
                    <div className="body-left">
                        {
                            modules.map(({ title, content }, idx) => (
                                <article id={toSlug(title)} className="content-section" key={idx}>
                                    <h2 className="body-title">{title}</h2>
                                    {
                                        content.map(({ content_html }, idx) => (
                                            <p key={idx} dangerouslySetInnerHTML={{ __html: sanitizeHtml(content_html) }} />
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

                    <SideNav heading="On this page" items={modules.map(({title}) => ({ text: title, address: `#${title}`}))}/>
                </div>
            </div>
        </Layout>
    )
}

export default OurMissionContainer