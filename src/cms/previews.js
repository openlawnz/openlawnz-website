import React from "react"

import NewsContainer from "@/containers/news/news"
import { OurMissionContainer } from "@/containers/our-mission/our-mission"


export function ourMissionPreview({ entry }) {
  return (
    <PreviewErrorBoundary>
        <OurMissionContainer {...entry.get("data").toJS()} />
    </PreviewErrorBoundary>
  )
}

export function newsPreview({ entry }) {
  return (
    <PreviewErrorBoundary>
        <NewsContainer newsItems={[ entry.get("data").toJS() ]} />
    </PreviewErrorBoundary>
  )
}


export class PreviewErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <p>
            Unable to render preview. This is probably due to required content fields that have not been completed yet.
          </p>
          <p>
            Once you have completed the fields in the content panel on the left, try loading the preview again by
            clicking on the button below.
          </p>
          <button onClick={() => this.setState({ hasError: false })}>Reload</button>
        </>
      )
    }
    return this.props.children
  }
}
