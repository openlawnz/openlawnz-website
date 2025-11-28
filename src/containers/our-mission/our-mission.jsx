import sanitizeHtml from 'sanitize-html'

import HeroSmall from "@/components/hero/hero-small"
import Layout from "@/components/layout/layout"
import SideNav from "@/components/side-nav/side-nav"
import toSlug from "@/helpers/to-slug"
import AndrewImage from "@/images/our-mission/andrew-easterbrook.jpg"
import WillImage from "@/images/our-mission/william-parry.jpg"

export const OurMissionContainer = ({title, modules}) => { 
    return (
        <Layout>
            <HeroSmall title={title} />
            <div className="inner">
                <div className="body-wrap content-page right-on-top">
                    <div className="body-left">
                        {
                            modules.map(({ title, content }, idx) => {
                                if (title === "Directors") {
                                    return (
                                        <div id="directors" className="content-section" key={title}>
                                            <h2 className="body-title">Directors</h2>
                                            <div className="directors-segments">
                                                {
                                                    content.map(({ content_html, name, title: roleTitle }, idx) => {
                                                        return (
                                                            <div key={idx}>
                                                                <img src={(name === "Andrew Easterbrook") ? AndrewImage : WillImage} alt={name} />
                                                                <h3>{name}, {roleTitle}</h3>
                                                                <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(content_html) }} />
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    )
                                }

                                return (
                                    <article id={toSlug(title)} className="content-section" key={idx}>
                                        <h2 className="body-title">{title}</h2>
                                        {
                                            content.map(({ content_html }, idx) => (
                                                <p key={idx} dangerouslySetInnerHTML={{ __html: sanitizeHtml(content_html) }} />
                                            ))
                                        }
                                    </article>
                                )
                                })
                        }
                    </div>

                    <SideNav heading="On this page" items={modules.map(({title}) => ({ text: title, address: `#${title}`}))}/>
                </div>
            </div>
        </Layout>
    )
}

export default OurMissionContainer