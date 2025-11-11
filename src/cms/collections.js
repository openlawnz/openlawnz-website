import { modules, title } from "./modules"

export const mission = {
    label: "Mission",
    label_singular: "Mission Item",
    name: "Mission",
    folder: "content/mission",
    extension: "json",
    create: true,
    fields: [
        title,
        modules,
        { label: "Date Posted", name: "data", widget: "datetime"}
    ]
}