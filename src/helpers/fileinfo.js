const { XMLParser, XMLBuilder, XMLValidator} = require('fast-xml-parser')
const config = require('../config')

const getFileData = (dataStr) => {
    var ret = {
        ext: '',
        desc: 'Unknown geo file format',
        format:'',
        data: undefined
    }
    //console.log(dataStr.toString().substr(0,4))

    let gpsContent = {}

    if(dataStr.startsWith('<?xml ')) {
        ret.format = 'xml'
        const parser = new XMLParser()
        gpsContent = parser.parse(dataStr)
        if(gpsContent.gpx){
            ret.ext = config.filetypes.gpx.ext
            ret.desc = config.filetypes.gpx.desc
        }
        if(gpsContent.kml){
            ret.ext = config.filetypes.kml.ext
            ret.desc = config.filetypes.kml.desc
        }
    } else if(dataStr.startsWith('{')){
        ret.format = 'json'
        gpsContent = JSON.parse(dataStr)
        //console.log(dataStr)
        if(gpsContent.type && gpsContent.type === config.filetypes.pgt.ext) {
            ret.ext = config.filetypes.pgt.ext
            ret.desc = config.filetypes.pgt.desc
        } else {
            ret.ext = config.filetypes.geojson.ext
            ret.desc = config.filetypes.geojson.desc
        }
    } else if(dataStr.startsWith('PK')){
        ret.format = 'zip'
        ret.ext = config.filetypes.zip.ext
        ret.desc = config.filetypes.zip.desc
    }

    ret.data = gpsContent

    return ret
}

module.exports = {
    getFileData
}