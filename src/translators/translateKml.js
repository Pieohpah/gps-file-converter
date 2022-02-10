const { XMLParser, XMLBuilder, XMLValidator} = require('fast-xml-parser')
const kmlmod = require('../models/KMLModel')
const mod = require('../models/PGGeoModel')
const common = require('../helpers/common')

const dataFromModel = (model) => {
    let ret = kmlmod.newKmlModel()

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