const { XMLParser, XMLBuilder, XMLValidator} = require('fast-xml-parser')
const admzip = require('adm-zip')
const path = require('path')

const filetypes = {
    gpx:{
        ext:'gpx',
        desc: 'GPS Exchange Format'
    },
    kml: {
        ext:'kml',
        desc: 'Keyhole Markup Language'
    },
    pgt: {
        ext:'pgt',
        desc: 'PlaceGaze Trails'
    },
    pgtz: {
        ext:'pgtz',
        desc: 'PlaceGaze Trails - Zip Archive'
    },
    geojson: {
        ext:'json',
        desc: 'GeoJSON'
    },
    zip: {
        ext: 'zip',
        desc: 'Zip Archive'
    }
}


const getFileData = (data, filename_extension) => {
    var ret = {
        ext: '',
        desc: 'Unknown geo file format',
        format:'',
        data: undefined
    }
    //console.log(dataStr.toString().substr(0,4))

    let gpsContent = {}

    if(data.toString().startsWith('<?xml ')) {
        const dataStr = data.toString()
        ret.format = 'xml'
        const options = {
            ignoreAttributes : false
        }
        const parser = new XMLParser(options)
        gpsContent = parser.parse(dataStr)
        if(gpsContent.gpx){
            ret.ext = filetypes.gpx.ext
            ret.desc = filetypes.gpx.desc
        }
        if(gpsContent.kml){
            ret.ext = filetypes.kml.ext
            ret.desc = filetypes.kml.desc
        }
    } else if(data.toString().startsWith('{')) {
        const dataStr = data.toString()
        ret.format = 'json'
        gpsContent = JSON.parse(dataStr)
        //console.log(dataStr)
        if(gpsContent.type && gpsContent.type === filetypes.pgt.ext) {
            ret.ext = filetypes.pgt.ext
            ret.desc = filetypes.pgt.desc
        } else {
            ret.ext = filetypes.geojson.ext
            ret.desc = filetypes.geojson.desc
        }
    } else if(filename_extension === '.zip' || filename_extension === '.pgtz'){
        const zip = new admzip(Buffer.from(data))
        let zipEntries = zip.getEntries()
        let type = path.extname(zipEntries[0].entryName).substring(1)
        gpsContent = zipEntries[0].getData().toString("utf8")
        ret.format = filename_extension === '.pgtz' ? 'pgtz':'zip'
        ret.ext = filetypes[type].ext
        ret.desc = filetypes[type].desc
    }

    ret.data = gpsContent
    return ret
}

module.exports = {
    getFileData
}