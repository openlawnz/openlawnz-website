import React from "react"
import "@/css/Footer.css"

import lawFoundationLogo from "@/images/global/law-foundation-logo.svg"

const Footer = () => (
    <footer>
        <div className="inner">
            <div id="footer-wrap">
                <div id="footer-left">
                    <p>
                        &copy; OpenLaw NZ <span>|</span> <a href="https://www.register.charities.govt.nz/Charity/CC55967">Registered NZ Charity</a>
                    </p>
                    <p><a href="https://seekvolunteer.co.nz/volunteering?organisationid=1567">Volunteering opportunities</a></p>
                </div>
                <div id="footer-right">
                    <div id="supported-by">
                        <p>Supported by</p>
                        <div>
                            <a href="https://www.lawfoundation.org.nz/">
                                <img
                                    id="supported-by-law-foundation"
                                    src={lawFoundationLogo}
                                    alt="The Law Foundation"/>
                            </a>
                            <a href="https://www.netlify.com">
                                <img
                                    src="https://www.netlify.com/img/global/badges/netlify-dark.svg"
                                    alt="Deployed by Netlify"/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
)
 
export default Footer