const { XMLParser, XMLBuilder, XMLValidator} = require('fast-xml-parser')
const kmlmod = require('../models/KMLModel')
const mod = require('../models/PGGeoModel')
const common = require('../helpers/common')
const xml = require('../helpers/xml')
const config = require('../config')

const dataFromModel = (model) => {
    let ret = kmlmod.newKmlModel()
    //console.log(model)
    if(model.name) {
        ret.kml.Document.name = xml.commentString(model.name)
    } else (
        delete ret.kml.Document.name
    )
    if(model.desc) {
        //ret.gpx.metadata.desc = xml.commentString(model.desc)
    } else {
        //delete ret.gpx.metadata.desc
    }
    //console.log(model.tracks.points)
    if(model.tracks.points.length > 0) {
        console.dir({t: model.tracks})
        ret.kml.Document.Style['@_id'] = config.kml.default.LineStyleId
        ret.kml.Document.Style.LineStyle = config.kml.default.LineStyle
        
        let pt = kmlmod.newKMLPlacemark(model.tracks.name,model.tracks.desc,model.tracks.points)
        ret.kml.Document.Placemark = pt
    }

    return common.XMLFromObj(ret)
}

const parseData = async(data) => {
    return new Promise((resolve, reject) =>{
        let content = {}
        let gpsContent = undefined
        if(typeof data === 'string'){
            const options = {
                ignoreAttributes : false
            }
            const parser = new XMLParser(options)
            gpsContent = parser.parse(str)
        } else {
            gpsContent = data
        }
        
        if(gpsContent) {
            content = mod.PGGeoFromKML(gpsContent)
            return resolve(content)
        } else {
            return reject('Data could not be parsed')
        }
    })
}

module.exports = {
    dataFromModel,
    parseData
}