import HeroSmall from "@/components/hero/hero-small"
import Layout from "@/components/layout/layout"
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