import { news, mission } from "./collections"

import { init, registerPreviewTemplate } from "netlify-cms-app"
import * as previews from "./previews/previews"
window.CMS_MANUAL_INIT = true

const { GATSBY_BRANCH } = process.env

const config = {
  backend: {
    name: "git-gateway",
    repo: "openlawnz/openlawnz-website",
    branch: GATSBY_BRANCH || "master",
  },
  collections: [
    news,
    mission
  ],
  media_folder: "static/assets",
  public_folder: "/assets",
  publish_mode: "editorial_workflow",
  local_backend: true,
}

init({ config })

registerPreviewTemplate("Mission", previews.ourMissionPreview)
registerPreviewTemplate("news", previews.newsPreview)


