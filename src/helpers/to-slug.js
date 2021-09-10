const toSlug = (string) => {
    return string.toLowerCase().replace(/\s+/g, "-")
}

export default toSlug