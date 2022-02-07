const common = require('../helpers/common')
const pgmodel = require('../models/PGGeoModel')

const pgtFromModel = (model, compressed) => {
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

module.exports = {
    pgtFromModel
}