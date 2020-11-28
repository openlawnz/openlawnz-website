import React from "react"

import { graphql } from "gatsby"
import Layout from "../components/Layout"
import HeroSmall from "../components/HeroSmall"

import "../css/Index.css"

const BlogPage = ({data}) => {

    const blogItems =  data.allNewsJson.nodes.sort((a,b) => {
        return +new Date(b.data) - +new Date(a.data);
    })
    console.log(blogItems)
    return (
        <Layout>
            <HeroSmall title="Blog"/>
            <div className="inner">
				<div className="body-wrap content-page right-on-top">
					<div className="body-left">
                        {
                            blogItems.map(({title, data, text}, idx) => (
                                <article id={title} className="content-section" key={idx}>
                                    <h2 className="body-title">{title}</h2>
                                    <p className="blog-meta">{data}</p>
                                    {
                                        text.map(({content_html}, idx) => (
                                            <p key={idx} dangerouslySetInnerHTML={{__html: content_html}}/>
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
                                        
                                        blogItems.map(({title}, idx) => (
                                            <li>
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

export default BlogPage;

export const query = graphql`
    query MyQuery {
        allNewsJson {
            nodes {
                title
                text {
                    content_html
                }
                data(formatString: "YYYY-MM-DD")
            }
        }
    }
`