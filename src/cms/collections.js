import { title, textModule } from "./modules"

export const news = {
    label: "News",
    label_singular: "News Item",
    name: "news",
    folder: "content/news",
    extension: "json",
    create: true,
    fields: [
        title,
        textModule,
        { label: "Date Posted", name: "data", widget: "datetime"}
    ]
}

export const mission = {
    label: "Mission",
    label_singular: "Mission Item",
    name: "Mission",
    folder: "content/mission",
    extension: "json",
    create: true,
    fields: [
        title,
        textModule,
        { label: "Date Posted", name: "data", widget: "datetime"}
    ]
}