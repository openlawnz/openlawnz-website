import "./case.css"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import HeroSmall from "@/components/hero/hero-small"
import Layout from "@/components/layout/layout"
import SEO from "@/components/seo"

const ADOBE_VIEW_SDK_SRC = "https://documentcloud.adobe.com/view-sdk/main.js"

const CaseContainer = (props) => {
  const [currentCase, setCurrentCase] = useState({})
  const [adobeDCView, setAdobeDCView] = useState(null)
  const [pdfError, setPdfError] = useState(false)
  const scriptErrorRef = useRef(false)

  const caseId = props["*"] || "No case"
  const pdfUrl = currentCase.id
    ? `https://openlawnz-pdfs-prod.s3-ap-southeast-2.amazonaws.com/${currentCase.id}`
    : ""

  const adobeUIConfig = useMemo(
    () => ({
      showDownloadPDF: true,
      showPrintPDF: true,
      embedMode: "IN_LINE",
    }),
    []
  )

  useEffect(() => {
    const controller = new AbortController()

    const loadCase = async () => {
      try {
        const params = new URLSearchParams({ case: caseId })
        const res = await fetch(`/api?${params.toString()}`, { signal: controller.signal })

        if (!res.ok) {
          setCurrentCase({})
          return
        }

        const caseData = await res.json()
        setCurrentCase(caseData.data?.caseCitation?.case || {})
      } catch (error) {
        if (error.name !== "AbortError") {
          setCurrentCase({})
        }
      }
    }

    loadCase()

    return () => {
      controller.abort()
    }
  }, [caseId])

  const adobeDCViewerCallback = useCallback(() => {
    if (!window.AdobeDC || adobeDCView) {
      return
    }

    setAdobeDCView(
      new window.AdobeDC.View({
        clientId: process.env.GATSBY_ADOBE_VIEW_KEY,
        divId: "adobe-dc-view",
      })
    )
  }, [adobeDCView])

  useEffect(() => {
    if (adobeDCView) {
      return
    }

    if (window.AdobeDC) {
      adobeDCViewerCallback()
      return
    }

    const existingScript = document.querySelector(`script[src="${ADOBE_VIEW_SDK_SRC}"]`)
    if (!existingScript) {
      const script = document.createElement("script")
      script.src = ADOBE_VIEW_SDK_SRC
      script.async = true
      script.onerror = () => {
        scriptErrorRef.current = true
        setPdfError(true)
      }
      document.body.appendChild(script)
    } else if (scriptErrorRef.current) {
      setPdfError(true)
      return
    }

    document.addEventListener("adobe_dc_view_sdk.ready", adobeDCViewerCallback)

    return () => {
      document.removeEventListener("adobe_dc_view_sdk.ready", adobeDCViewerCallback)
    }
  }, [adobeDCView, adobeDCViewerCallback])

  useEffect(() => {
    if (!adobeDCView || !currentCase.id) {
      return
    }

    adobeDCView
      .previewFile(
        {
          content: {
            location: {
              url: pdfUrl,
            },
          },
          metaData: { fileName: `${currentCase.caseName || "case"}.pdf` },
        },
        adobeUIConfig
      )
      .catch(() => {
        setPdfError(true)
      })
  }, [adobeDCView, adobeUIConfig, currentCase.caseName, currentCase.id, pdfUrl])

  return (
    <Layout>
      <SEO
        title={caseId}
        description="OpenLaw NZ is an open-source legal data platform. Our goal is to improve the accessibility of case law 
                and other legal information in New Zealand. We want to make it easier for all New Zealanders to understand law. "
      />
      <HeroSmall title={currentCase.caseName ? currentCase.caseName : caseId} />

      <div className="inner">
        <div id="case-body" className="hidden body-wrap right-on-top">
          <div className="body-left">
            <div id="pdf">
              {pdfError ? (
                <div>
                  <p className="pdf-error">
                    The PDF viewer failed to load.
                    {currentCase.id ? (
                      <>
                        {" "}
                        Showing the browser PDF view instead. You can also{" "}
                        <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                          download the PDF directly
                        </a>
                        .
                      </>
                    ) : (
                      " Try refreshing the page."
                    )}
                  </p>
                  {currentCase.id && <iframe className="pdf-fallback-frame" src={pdfUrl} title="Case PDF" />}
                </div>
              ) : (
                <div id="adobe-dc-view"></div>
              )}
            </div>
          </div>
          <div className="body-right">
            <div id="case-information" className="on-this-page">
              <h2>Information</h2>
              <h3>Cites</h3>
              <ul id="cites">
                {currentCase.casesCitedsByCaseOrigin && currentCase.casesCitedsByCaseOrigin.length > 0 ? (
                  <>
                    {currentCase.casesCitedsByCaseOrigin
                      .filter(({ caseByCaseCited }) => caseByCaseCited.caseCitations.length > 0)
                      .map(({ caseByCaseCited }, idx) => (
                        <li key={idx}>
                          <a href={`/case/${caseByCaseCited.caseCitations[0].id}`}>{caseByCaseCited.caseName}</a>
                        </li>
                      ))}
                  </>
                ) : (
                  <li>This case does not cite other cases.</li>
                )}
              </ul>

              <h3>Cited by</h3>
              <ul id="citedBy">
                {currentCase.casesCitedsByCaseCited && currentCase.casesCitedsByCaseCited.length > 0 ? (
                  <>
                    {currentCase.casesCitedsByCaseCited.map(({ caseByCaseOrigin }, idx) => {
                      return (
                        <li key={idx}>
                          <a href={`/case/${caseByCaseOrigin.caseCitations[0]?.id}`}>{caseByCaseOrigin.caseName}</a>
                        </li>
                      )
                    })}
                  </>
                ) : (
                  <li>No other case cite this case.</li>
                )}
              </ul>

              <h3>Legislation</h3>
              <ul id="legislation">
                {currentCase.legislationToCases && currentCase.legislationToCases.length > 0 ? (
                  <>
                    {currentCase.legislationToCases.map(({ legislation, section }, idx) => {
                      return (
                        <li key={idx}>
                          <a
                            href={`https://legislation.govt.nz${legislation.link}`}
                          >{`${legislation.title}, ${section}`}</a>
                        </li>
                      )
                    })}
                  </>
                ) : (
                  <li>No Legislation Cited</li>
                )}
              </ul>

              <h3>Parser Version</h3>
              <div id="parsersVersion">
                <p>{currentCase.parsersVersion ? `${currentCase.parsersVersion}` : "-"}</p>
              </div>

              <div id="disclaimer">
                <h2>Disclaimer</h2>
                <p>
                  This data is automatically extracted from PDF files. While OpenLaw NZ makes every effort to provide
                  accurate data, it is not something we can guarantee.
                </p>
                <p>
                  You can view the OpenLaw NZ source code on <a href="https://github.com/openlawnz">Github</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CaseContainer
