import React from "react"

import { graphql } from "gatsby"
import Layout from "@/components/layout/layout"
import HeroSmall from "@/components/hero/hero-small"
import sanitizeHtml from 'sanitize-html'

import "@/css/Index.css"

const NewsContainer = (props) => {
    console.log(props)
    const { newsItems } = props

    return (
        <Layout>
            <HeroSmall title="Blog"/>
            <div className="inner">
				<div className="body-wrap content-page right-on-top">
					<div className="body-left">
                        {
                            newsItems.map(({title, data, text}, idx) => (
                                <article id={title} className="content-section" key={idx}>
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
                
                    <div className="body-right">
                        <div className="on-this-page">
                            <h2>On this page</h2>
                            <nav>
                                <ul>
                                    {
                                        
                                        newsItems.map(({title}, idx) => (
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

export default NewsContainer