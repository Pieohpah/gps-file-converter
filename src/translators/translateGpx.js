const { XMLParser, XMLBuilder, XMLValidator} = require('fast-xml-parser')
const gpxmod = require('../models/GPXModel')
const mod = require('../models/PGGeoModel')
const common = require('../helpers/common')
const {parseDate} = require('../helpers/date')
const xml = require('../helpers/xml')

const dataFromModel = (model, options) => {
    if(!options) {
        options = mod.newExportOptions()
    }
    let ret= gpxmod.newGpxModel()
    if(model.name) {
        ret.gpx.metadata.name = xml.commentString(model.name)
    } else (
        delete ret.gpx.metadata.name
    )
    if(model.desc) {
        ret.gpx.metadata.desc = xml.commentString(model.desc)
    } else (
        delete ret.gpx.metadata.desc
    )
    if(model.link && model.link.url !== ''){
        let l = gpxmod.newLink(model.link.url, model.link.text)
        ret.gpx.metadata.link = l
    } else {
        delete ret.gpx.metadata.link
    }
    if(model.timestamp) {
        let d = parseDate(model.timestamp)
        ret.gpx.metadata.time = d.gpzdate
    } else {
        delete ret.gpx.metadata.time
    }
    if(!options.onlyTracks) {
        let wps = model.waypoints
        if(!wps || wps.length === 0) {
            delete ret.gpx.wp
        } else {
            wps.forEach(w => {
                let wp = gpxmod.newWayPoint(w.point[0], w.point[1], w.point[2], w.name)
                ret.gpx.wpt.push(wp)
            })
        }
    }
 
    if(!options.onlyWaypoints) {
        let tks = model.tracks
        if(!tks) {
            delete ret.gpx.trk
        } else {
            let ord = 1
            tks.forEach(tk => {
                let track = gpxmod.newTrack(xml.commentString(tk.name),xml.commentString(tk.desc),[],ord)
                let points = tk.points

                if(options.optimizationLevel !== mod.optimizationLevel.lossless) {
                    points = mod.optimizePointArray(points, options.optimizationLevel)
                }

                points.forEach(p => {
                    let tp = gpxmod.newTrackPoint(p[0], p[1], p[2])
                    track.trkseg.trkpt.push(tp)
                })
                ret.gpx.trk.push(track)
                ord += 1
            })
        }
    }

    return common.XMLFromObj(ret)
}

const parseData = async(data) => {
    return new Promise((resolve, reject) =>{
        let content = {}
        let gpsContent = undefined
        if(typeof data === 'string'){
            const options = {
                ignoreAttributes : false,
            }
            const parser = new XMLParser(options)
            gpsContent = parser.parse(data)
        } else {
            gpsContent = data
        }
        
        if(gpsContent) {
            content = mod.PGGeoFromGPX(gpsContent)
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
