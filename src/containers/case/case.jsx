import { Link } from "gatsby"
import React, { useEffect } from "react"
import HeroSmall from "@/components/hero/hero-small"
import Layout from "@/components/layout/layout"
import SEO from "@/components/seo"


import "./case.css"

const CaseContainer = (props) => {
    const [ currentCase, setCurrentCase ] = React.useState({})
    const [adobeDCView, setAdobeDCView] = React.useState(null)

    const caseId = props['*'] || "No case"

    const adobeUIConfig = {
        showDownloadPDF: true,
        showPrintPDF: true,
        embedMode: "IN_LINE"
    }
    useEffect(() => {
       (async () => {
            const res = await fetch(`/api?case=${caseId}`) 

            const caseData = await res.json()

            setCurrentCase(caseData.data?.caseCitation?.case)
       })()
   }, [caseId, setCurrentCase])

   const adobeDCViewerCallback = () => {
     setAdobeDCView(
       new window.AdobeDC.View({
         clientId: process.env.GATSBY_ADOBE_VIEW_KEY,
         divId: "adobe-dc-view",
       })
     )
   }
   
   useEffect(() => {
     if (window.AdobeDC && !adobeDCView) {
       adobeDCViewerCallback()
     } else if (!window.AdobeDC) {
       const script = document.createElement("script")
       script.src = "https://documentcloud.adobe.com/view-sdk/main.js"
       document.querySelector("body").appendChild(script)
       document.addEventListener("adobe_dc_view_sdk.ready", adobeDCViewerCallback)
     }
   }, [adobeDCView])
   
   useEffect(() => {
     if (!adobeDCView || !currentCase.id) return
     adobeDCView.previewFile(
       {
         content: {
           location: {
             url: `https://openlawnz-pdfs-prod.s3-ap-southeast-2.amazonaws.com/${currentCase.id}`,
           },
         },
         metaData: { fileName: `${currentCase.caseName}.pdf` },
       },
       adobeUIConfig
     )
   }, [currentCase, adobeDCView, adobeUIConfig])

    return (
        <Layout>
            <SEO 
                title={caseId}
                description="OpenLaw NZ is an open-source legal data platform. Our goal is to improve the accessibility of case law 
                and other legal information in New Zealand. We want to make it easier for all New Zealanders to understand law. "
            />
            <HeroSmall title={currentCase.caseName ? currentCase.caseName : caseId}/>

        
            <div className="inner">
				<div id="case-body" className="hidden body-wrap right-on-top">
					<div className="body-left">
						<div id="pdf">
							<div id="adobe-dc-view"></div>
						</div>
					</div>
					<div className="body-right">
						<div id="case-information" className="on-this-page">
							<h2>Information</h2>
							<h3>Cites</h3>
							<ul id="cites">
                            {
                                currentCase.casesCitedsByCaseOrigin && currentCase.casesCitedsByCaseOrigin.length > 0 ?
                                <>
                                {
                                    currentCase.casesCitedsByCaseOrigin.map(({caseByCaseCited}, idx) => {
                                        if(caseByCaseCited.caseCitations.length === 0) return undefined
                                        return (
                                            <li key={idx}>
                                                <Link to={`/case/${caseByCaseCited.caseCitations[0].id}`}>
                                                    {caseByCaseCited.caseName}
                                                </Link>
                                            </li>
                                        )
                                    })
                                }
                                </> :
                                <li>
                                    This case does not cite other cases.
                                </li>
                            }
								
							</ul>

							<h3>Cited by</h3>
							<ul id="citedBy">
                                {
                                    currentCase.casesCitedsByCaseCited && currentCase.casesCitedsByCaseCited.length > 0 ?
                                    <>
                                    {
                                        currentCase.casesCitedsByCaseCited.map(({caseByCaseOrigin}, idx) => {
                                            return (
                                                <li key={idx}>
                                                    <Link to={`/case/${caseByCaseOrigin.caseCitations[0].id}`}>
                                                        {caseByCaseOrigin.caseName}
                                                    </Link>
                                                </li>
                                            )
                                        })
                                    }
                                    </> :
                                    <li>
                                        No other case cite this case.
                                    </li>
                                }
								
							</ul>

							<h3>Legislation</h3>
							<ul id="legislation">
                                {
                                    currentCase.legislationToCases && currentCase.legislationToCases.length > 0 ?
                                    <>
                                    {
                                        currentCase.legislationToCases.map(({legislation, section}, idx) => {
                                            return (
                                                <li key={idx}>
                                                    <a href={`http://legislation.govt.nz${legislation.link}`}>
                                                        {`${legislation.title}, ${section}`}
                                                    </a>
                                                </li>
                                            )
                                        })
                                    }
                                    </> :
                                    <li>
                                    No Legislation Cited
                                    </li>
                                }
								
							</ul>

                            <h3>Parser Version</h3>
							<div id="parsersVersion">
								<p>
                                    {
                                        currentCase.parsersVersion ? `${currentCase.parsersVersion}` : '-'
                                    }
								</p>
							</div>

							<div id="disclaimer">
								<h2>Disclaimer</h2>
								<p>This data is automatically extracted from PDF files. While OpenLaw NZ makes every effort to provide accurate data, it is not something we can guarantee.</p>
								<p>You can view the OpenLaw NZ source code on <a href="https://github.com/openlawnz">Github</a></p>
							</div>
							
						</div>

					</div>
				</div>
			</div>
            
        </Layout>
    )
}

export default CaseContainer
