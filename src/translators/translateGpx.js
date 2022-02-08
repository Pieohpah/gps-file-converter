const { XMLParser, XMLBuilder, XMLValidator} = require('fast-xml-parser')
const mod = require('../models/PGGeoModel')

const gpxFromModel = (m) => {



}

const parseGPX = async(data) => {
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
            content = mod.PGGeoFromGPX(gpsContent)

        } else {
            return reject('Data could not be parsed')
        }
        return resolve(content)
    })
}

module.exports = {
    gpxFromModel,
    parseGPX
}
