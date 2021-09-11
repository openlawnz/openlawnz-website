const toSlug = (string) => {
    if(!string) return ""
    return string.toLowerCase().replace(/\s+/g, "-")
}

export default toSlug