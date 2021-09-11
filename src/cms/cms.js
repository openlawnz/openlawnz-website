import * as previews from "./previews"
import { news, mission } from "./collections"
import { init, registerPreviewTemplate } from "netlify-cms-app"

window.CMS_MANUAL_INIT = true

const config = {
  backend: {
    name: "git-gateway",
    repo: "openlawnz/openlawnz-website",
    branch: "master",
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


