const admzip = require('adm-zip')
const common = require('../helpers/common')
const pgmodel = require('../models/PGGeoModel')

const dataFromModel = (model, compressed) => {
    let m = common.deepCopy(model)
    if(compressed){
        let tps = m.tracks ? m.tracks.points : undefined
        if(tps){
            let compressed = pgmodel.compressPointArray(tps)
            m.tracks.points = compressed
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
            let compressedTrackPoints = gpsContent.tracks.points
            if(compressedTrackPoints) {
                let dec = pgmodel.deCompressPointArray(compressedTrackPoints)
                gpsContent.tracks.points = dec
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