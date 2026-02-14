import "@/css/index.css"

import { Link } from "gatsby"

import HeroLarge from "@/components/hero/hero"
import Layout from "@/components/layout/layout"
import SEO from "@/components/seo"
import howToUseImage from "@/images/home/explore/how-to-use.svg"
import ourMissionImage from "@/images/home/explore/our-mission.svg"
import fundImage from "@/images/home/our-mission/fund.svg"
import improveImage from "@/images/home/our-mission/improve.svg"
import spurImage from "@/images/home/our-mission/spur.svg"

const HomePage = () => {
  return (
    <Layout>
      <SEO title="Home" description="OpenLaw NZ is a new, free legal research platform for New Zealand." />
      <HeroLarge />

      <div className="inner">
        <div className="body-wrap">
          <div className="body-left">
            <div className="our-mission">
              <h2 className="body-title">Our Mission</h2>
              <p>
                OpenLaw NZ is an open-source platform that any country can copy and use for
                <br />
                the betterment of their citizens.
              </p>

              <div className="mission-segments">
                <div>
                  <img src={improveImage} alt="" loading="lazy" decoding="async" />
                  <p>Improve access to justice and education for all New Zealanders</p>
                </div>
                <div>
                  <img src={spurImage} alt="" loading="lazy" decoding="async" />
                  <p>Spur innovation with a freely available API</p>
                </div>
                <div>
                  <img src={fundImage} alt="" loading="lazy" decoding="async" />
                  <p>Fund future development by providing services using the OpenLaw NZ platform</p>
                </div>
              </div>
            </div>

            <div className="explore">
              <h2 className="body-title">Explore OpenLaw NZ</h2>
              <div className="explore-segments">
                <Link to="/how-to-use">
                  <img src={howToUseImage} alt="" loading="lazy" decoding="async" />
                  <p>How to use OpenLaw NZ</p>
                </Link>
                <Link to="/our-mission">
                  <img src={ourMissionImage} alt="" loading="lazy" decoding="async" />
                  <p>Our mission</p>
                </Link>
              </div>
            </div>

            <div className="contact-us">
              <h2 className="body-title">Contact Us</h2>
              <p>We'd love to hear feedback and things you have done with the platform</p>
              <a href="mailto:enquiries@openlaw.nz" className="primary-button">
                Get in touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default HomePage
