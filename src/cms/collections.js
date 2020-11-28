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