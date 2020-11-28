export const title = { label: "Title", name: "title" }
export const heading = { label: "Heading", name: "title" }
export const description = { label: "Description", name: "description", widget: "markdown"}

export const text = { label: "Text", name: "text", summary: "{{title}} (Text)", fields: [
  title,
  { label: "Text", name: "content", widget: "list", fields: [
    { label: "Summary", name: "title", hint: "This will not appear on the page"},
    { name: "content_html", label: "Content", widget: "markdown"}
  ]}
]}

export const textModule = { label: "Text", name: "text", widget: "list", summary: "{{title}} (Text)", fields: [   
    { label: "Summary", name: "title", hint: "This will not appear on the page"},
    { name: "content_html", label: "Content", widget: "markdown"}
]}

const directors = { label: "Directors List", name: "directors", summary: "{{title}} (Directors)", fields: [
  heading,
  { label: "Directors", name: "content", widget: "list", fields: [
    { label: "Name", name: "name" },
    { label: "Bio", name: "content_html", widget: "markdown" },
    { label: "Image", name: "image_url", widget: "image"}
  ]}
]}

export const labelImage = {
  label: "Image",
  name: "image_url",
  widget: "image",
  media_library: {config: {multiple: false}}
}

export const modules = { label: "Modules", label_singular: "Module", name: "modules", widget: "list", types: [
    text,
    directors,
]}