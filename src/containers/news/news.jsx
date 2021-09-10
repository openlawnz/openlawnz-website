import React from "react"

import { graphql } from "gatsby"
import Layout from "@/components/layout/layout"
import HeroSmall from "@/components/hero/hero-small"
import sanitizeHtml from 'sanitize-html'
import toSlug from "@/helpers/to-slug"

import SideNav from "@/components/side-nav/side-nav"



const NewsContainer = (props) => {
    const { newsItems } = props

    return (
        <Layout>
            <HeroSmall title="News"/>
            <div className="inner">
				<div className="body-wrap content-page right-on-top">
					<div className="body-left">
                        {
                            newsItems.map(({title, data, text}, idx) => (
                                <article id={toSlug(title)} className="content-section" key={idx}>
                                    <h2 className="body-title">{title}</h2>
                                    <p className="blog-meta">{data}</p>
                                    {
                                        text.map(({content_html}, idx) => (
                                            <p key={idx} dangerouslySetInnerHTML={{__html: sanitizeHtml(content_html)}}/>
                                        ))
                                    }
                                </article>
                            ))
                        }
                    </div>
                

                    <SideNav heading="On this page" items={newsItems.map(({title}) => ({text: title, address: `#${toSlug(title)}`}))}/>
                </div>
            </div>
        </Layout>
    )
}

export default NewsContainer