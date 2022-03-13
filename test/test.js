const GFC = require('../gps-file-converter')
const geo = new GFC()
const model = require('../src/models/PGGeoModel')
const gpxmod = require('../src/models/GPXModel')
const tpg = require('../src/translators/translatePgt')
const ft = require('../src/helpers/fileinfo')
const common = require('../src/helpers/common')

const xmlTool = require('../src/helpers/xml')
const met = require('../src/helpers/geometrics')



const t = async() => {
    /*
    const c1 = met.newCoordinate(59.30275,18.10384)
    const c2 = met.newCoordinate(59.3029,18.10397)
    const c3 = met.newCoordinate(59.30293,18.1041)
    const c4 = met.newCoordinate(59.30293,18.10427)
    const c5 = met.newCoordinate(59.30285,18.10446)

    console.log({b1:met.bearing(c1,c2)})
    console.log({d1:met.distanceMeters(c1,c2)})
    console.log({b2:met.bearing(c2,c3)})
    console.log({d2:met.distanceMeters(c2,c3)})

    console.log({b3:met.bearing(c3,c4)})
    console.log({d3:met.distanceMeters(c3,c4)})
    console.log({b4:met.bearing(c4,c5)})
    console.log({d4:met.distanceMeters(c4,c5)})

    console.log({b:met.bearing(c1,c5)})
    console.log({d:met.distanceMeters(c1,c5)})

    const arr = [c1,c2,c3,c4,c5]
    console.log(model.optimizePointArray(arr, model.optimizationLevel.lossless))
    return
    */
    
}
t()

