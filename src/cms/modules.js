export const title = { label: "Title", name: "title" }
export const heading = { label: "Heading", name: "title" }
export const description = { label: "Description", name: "description", widget: "markdown"}

const text = { label: "Text", name: "text", summary: "{{title}} (Text)", fields: [
  title,
  { label: "Text", name: "content", widget: "list", fields: [
    { label: "Summary", name: "title", hint: "This will not appear on the page"},
    { name: "content_html", label: "Content", widget: "markdown"}
  ]}
]}

const contributorsList = { label: "Contributors List", name: "contributors", summary: "{{title}} (Contributors)", fields: [
  heading,
  { label: "Contributors", name: "content", widget: "list", fields: [
    { label: "Name", name: "title"},
    { label: "Image", name: "content_html", widget: "image", media_library: {config: {multiple: false}}}
  ]}
]}
const directors = { label: "Directors List", name: "directors", summary: "{{title}} (Directors)", fields: [
  heading,
  { label: "Directors", name: "content", widget: "list", fields: [
    { label: "Name", name: "name" },
    { label: "Bio", name: "content_html", widget: "markdown" },
    { label: "Image", name: "image_url", widget: "image"}
  ]}
]}

const checklist = { label: "Checklist", name: "checklist", summary: "{{title}} (Checklist)", fields: [
  heading,
  { label: "Checklist Items", label_singular: "Checklist Item", name: "content", widget: "list", fields: [
    title,
    { label: "Sub Items", label_singular: "Sub Item", name: "subitems", widget: "list", fields: [
      title,
      { label: "Content", name: "content"}
    ]}
  ]}
]}

const accordion = { label: "Accordion", name: "accordion", summary: "{{title}} (Accordion)", fields: [
  title,
  { label: "Items", label_singular: "Item", name: "content", widget: "list", fields: [
    { label: "Heading", name: "question" },
    { label: "Content", name: "content", widget: "text"}
  ]}
]}

const wizard = { label: "Wizard", name: "wizard", summary: "{{title}} (Wizard)", fields: [
  title,
  { label: "Select Wizard", widget: "relation", collection: "wizards", searchFields: ["title"], valueField: "key", displayFields: ["title"]},
]}

const caseList = { label: "Case List", name: "case_list", fields: [
  title,
  { label: "Cases", label_singular: "Case", name: "cases", widget: "case_list"}
]}

export const labelImage = {
  label: "Image",
  name: "image_url",
  widget: "image",
  media_library: {config: {multiple: false}}
}

export const modules = { label: "Modules", label_singular: "Module", name: "modules", widget: "list", types: [
    text,
    contributorsList,
    directors,
    checklist,
    accordion,
    wizard,
    caseList,
  ]}