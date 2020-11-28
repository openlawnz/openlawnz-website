import { title, labelImage, description, modules } from "./modules"

export const sections = {
    label: "Sections",
    label_singular: "Section",
    name: "content",
    widget: "list",
    fields: [
        title,
        modules
    ]
}

export const ourMission = {
    label: "Our Mission", 
    label_singular: "Page",
    name: "ourMission", 
    folder: "content/our-mission", 
    extension: "json",
    create: true, 
    fields: [
        title,
        description,
        modules
    ]
}
  
export const getEmpowered = {
    label: "Get Empowered", 
    label_singular: "Page",
    name: "getEmpowered", 
    folder: "content/get-empowered", 
    extension: "json",
    create: true, 
    fields: [
        title,
        description,
        labelImage,
        modules
    ]
}

export const getInvolved = {
    label: "Get Involved", 
    label_singular: "Page",
    name: "getInvolved", 
    folder: "content/get-involved", 
    extension: "json",
    create: true, 
    fields: [
        title,
        description,
        labelImage,
        modules
    ]
}
  
  
  
export const microsites = {
    label: "Microsites",
    label_singular: "Microsite",
    name: "microsites",
    folder: "content/microsites",
    extension: "json",
    create: true,
    fields: [
        title, 
        description,
        labelImage,
        sections
    ]
}

export const news = {
    label: "News",
    label_singular: "News Item",
    name: "news",
    folder: "content/news",
    extension: "json",
    create: true,
    fields: [
        title,
        { Label: "Summary", name: "summary" },
        { name: "content_html", label: "Content", widget: "markdown"},
        labelImage,
        { label: "Image Alt", name: "image_alt"},
        { label: "Date Posted", name: "data", widget: "datetime"}
    ]
}

const wizardPattern = {
    pattern: ['[a-z0-9_]+', "Only lower case letters, numbers and underscores can be used"],
    hint: "The unique key for this step. Once created, do not change this. Only lower case letters, numbers and underscores can be used."
}

export const wizards = {
    label: "Wizards",
    label_singular: "Wizard",
    name: "wizards",
    folder: "content/wizard",
    extension: "json",
    create: true,
    fields: [
        title,
        { label: "Key", name: "key", ...wizardPattern},
        { label: "Background Image", name: "background", widget: "image", media_library: {config: {multiple: false}}},
        
        { label: "Steps", label_singular: "Step", name: "steps", widget: "list", fields: [
            { label: "Label", name: "label"},
            { label: "Key", name: "key", ...wizardPattern},
            { label: "Question", name: "question", widget: "text"},
            { label: "Options", label_singular: "Option", name: "options", summary: "{{label}}", widget: "list", types: [
                { label: "Leaf Option", name: "leaf_option", summary: "{{label}} (Leaf)", fields: [
                    { label: "Label", name: "label" },
                    { label: "Value", name: "value", ...wizardPattern },
                    { label: "Content", name: "content", widget: "markdown"},
                    { label: "Tooltip", name: "tooltip", widget: "text", required: false}
                ]},
                { label: "Branch Option", name: "branch_option", summary: "{{label}} (Branch)", fields: [
                    { label: "Label", name: "label"},
                    { label: "Value", name: "value", ...wizardPattern},
                    { label: "Next Step", name: "next", widget: "wizard_option_next"},
                    { label: "Tooltip", name: "tooltip", widget: "text", required: false},
                ]}
            ]}
        ]}
    ]
}
