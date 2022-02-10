const { XMLParser, XMLBuilder, XMLValidator} = require('fast-xml-parser')
const gpxmod = require('../models/GPXModel')
const mod = require('../models/PGGeoModel')
const common = require('../helpers/common')
const {parseDate} = require('../helpers/date')
const xml = require('../helpers/xml')

const dataFromModel = (model) => {
    let ret= gpxmod.newGpxModel()
    //console.log(model)
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
    let wps = model.waypoints
    if(!wps || wps.length === 0) {
        delete ret.gpx.wp
    } else {
        wps.forEach(w => {
            let wp = gpxmod.newWayPoint(w.point[0], w.point[1], w.point[2], w.name)
            ret.gpx.wpt.push(wp)
        })
    }
 
    let tks = model.tracks
    if(!tks) {
        delete ret.gpx.trk
    } else {
        if(!tks.name) {
            delete ret.gpx.trk.name
        } else {
            ret.gpx.trk.name = xml.commentString(tks.name)
        }
        if(!tks.desc) {
            delete ret.gpx.trk.desc
        } else {
            ret.gpx.trk.desc = xml.commentString(tks.desc)
        }
        let points = tks.points

        points.forEach(p => {
            //console.log(p)
            let tp = gpxmod.newTrackPoint(p[0], p[1], p[2])
            //console.log(tp)
            ret.gpx.trk.trkseg.trkpt.push(tp)
        })
    }

    return common.XMLFromObj(ret)
}

const parseData = async(data) => {
    return new Promise((resolve, reject) =>{
        let content = {}
        let gpsContent = undefined
        if(typeof data === 'string'){
            //console.log(111)
            const options = {
                ignoreAttributes : false,
                //cdataPropName: '__cdata'
            }
            const parser = new XMLParser(options)
            gpsContent = parser.parse(data)
        } else {
            //console.log(222 + ' - ' + typeof data)
            //console.log(data)
            gpsContent = data
        }
        //console.log({c:gpsContent.gpx.trk.trkseg.trkpt[0]})
        
        if(gpsContent) {
            content = mod.PGGeoFromGPX(gpsContent)
            //console.log({c:content.tracks.points})
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
