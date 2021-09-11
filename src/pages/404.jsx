import React from "react"
import Layout from "@/components/layout/layout"
import HeroSmall from "@/components/hero/hero-small"
import SEO from "@/components/seo"

const NotFoundPage = () => {
  const browser = typeof window !== "undefined" && window

  return (
    <Layout>
      {
        browser &&
        <>
          <SEO
            title="404 Page not Found"
            description="Page not found"
          />
          <HeroSmall title="Page not found"/>     
          <div className="inner">
            <div className="body-wrap content-page right-on-top">
              <div className="body-left">
                <div id="mission-statement" className="content-section">
                  <h2 className="body-title">Page Not Found</h2>
                    <p>
                      If you believe this is an error, contact our <a href="mailto:enquiries@openlaw.nz">development team.</a>
                    </p>

                    <form className="contact-form" name="contact" method="POST" netlify data-netlify="true">
                      <input type="hidden" name="form-name" value="contact" />

                      <label htmlFor="name" className="show-for-sr">Your Name: </label>    
                      <input placeholder="Name" type="text" name="name" />

                      <label htmlFor="email" className="show-for-sr">Your Email: </label>
                      <input placeholder="Email" type="email" name="email" />

                      <label htmlFor="message" className="show-for-sr">Message: </label> 
                      <textarea placeholder="Message" name="message"></textarea>

                      <button type="submit">Send</button>
                    </form>
                </div>
              </div>
            </div>
          </div>
        </>
      }
        
    </Layout>
  )
  
}

export default NotFoundPage