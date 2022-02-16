const admzip = require('adm-zip')
const common = require('../helpers/common')
const pgmodel = require('../models/PGGeoModel')

const dataFromModel = (model, options) => {
    if(!options) {
        options = pgmodel.newExportOptions()
    }
    let m = common.deepCopy(model)
    if(options.onlyTracks) {
        m.waypoints = []
    }
    if(options.onlyWaypoints) {
        m.tracks = []
    }
    if(options.useCompression){
        let tps = m.tracks ? m.tracks[0].points : undefined //TODO: Mayby not only the first
        if(tps){
            if(options.optimizationLevel !== pgmodel.optimizationLevel.lossless) {
                tps = pgmodel.optimizePointArray(tps, options.optimizationLevel)
            }
            let compressed = pgmodel.compressPointArray(tps)
            m.tracks[0].points = compressed
        } 
    }
    return JSON.stringify(m,'',2)
}

const parseData = async(data) => {
    return new Promise((resolve, reject) =>{
        let gpsContent = undefined
        if(typeof data === 'string'){
            const options = {
                ignoreAttributes : false
            }
            gpsContent = JSON.parse(data)
        } else {
            gpsContent = data
        }
        if(gpsContent) {
            let compressedTrackPoints = gpsContent.tracks[0].points
            if(compressedTrackPoints) {
                let dec = pgmodel.deCompressPointArray(compressedTrackPoints)
                gpsContent.tracks[0].points = dec
            }            
            return resolve(gpsContent)
        }  else {
            return reject('Data could not be parsed')
        }  
    })
}

module.exports = {
    dataFromModel,
    parseData,
}