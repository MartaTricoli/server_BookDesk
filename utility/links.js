const formatLink = (url, placeholder, value) => {
    return url.replace(new RegExp(placeholder, "g"), value);
}

module.exports = {
    formatLink
}