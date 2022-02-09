const { XMLParser, XMLBuilder, XMLValidator} = require('fast-xml-parser')
const mod = require('../models/PGGeoModel')

const dataFromModel = (model) => {

}

const parseData = async(data) => {
    return new Promise((resolve, reject) =>{
        let content = {}
        let gpsContent = undefined
        if(typeof data === 'string'){
            //console.log(111)
            const options = {
                ignoreAttributes : false
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
