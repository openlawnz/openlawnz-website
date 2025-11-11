import { init, registerPreviewTemplate } from "netlify-cms-app"

import { mission } from "./collections"
import * as previews from "./previews"

window.CMS_MANUAL_INIT = true

const config = {
  backend: {
    name: "git-gateway",
    repo: "openlawnz/openlawnz-website",
    branch: "master",
  },
  collections: [
    mission
  ],
  media_folder: "static/assets",
  public_folder: "/assets",
  publish_mode: "editorial_workflow",
  local_backend: true,
}

init({ config })

registerPreviewTemplate("Mission", previews.ourMissionPreview)


