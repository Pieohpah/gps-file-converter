const commentString = (str) => {
    return `<![CDATA[${str}]]>`
}

const deCommentString = (str) => {
    return str.replace('<![CDATA[','').replace(']]>','')
}

module.exports = {
    commentString,
    deCommentString
}