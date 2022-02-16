const { XMLParser, XMLBuilder, XMLValidator} = require('fast-xml-parser')
const kmlmod = require('../models/KMLModel')
const mod = require('../models/PGGeoModel')
const common = require('../helpers/common')
const xml = require('../helpers/xml')
const config = require('../config')

const dataFromModel = (model, options) => {
    if(!options) {
        options = mod.newExportOptions()
    }
    let ret = kmlmod.newKmlModel()
    if(model.name) {
        ret.kml.Document.name = xml.commentString(model.name)
    } else (
        delete ret.kml.Document.name
    )
    if(model.desc) {
        ret.kml.Document.description = xml.commentString(model.desc)
    } else {
        delete ret.kml.Document.description
    }

    if(!options.onlyTracks) {
        const wpStyleId = 'waypoint'
        let style = kmlmod.newWaypointStyle(wpStyleId)

        ret.kml.Document.StyleMap.push(...style.StyleMap)
        ret.kml.Document.Style.push(...style.Style)

        model.waypoints.forEach(wp => {
            let w = kmlmod.newKMLWaypoint(wp.name,wp.desc,wp.point,wpStyleId)
            ret.kml.Document.Placemark.push(w)
        })
    }
    
    if(!options.onlyWaypoints) {
        let nr = 1
        model.tracks.forEach(tr => {
            if(tr.points.length > 0) {
                const trStyleId = `waytogo_${nr}`
                let tstyle = kmlmod.newTrackStyle(trStyleId,'Red')
                ret.kml.Document.StyleMap.push(...tstyle.StyleMap)
                ret.kml.Document.Style.push(...tstyle.Style)
                
                let pt = kmlmod.newKMLTrack(tr.name,tr.desc,tr.points,trStyleId)
                ret.kml.Document.Placemark.push(pt)
                nr++
            }
        })
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