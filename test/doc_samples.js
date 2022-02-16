const GFC = require('../gps-file-converter')
// const GFC = require('gps-file-converter')
const gfc = new GFC()


// Input
// From file
const sample = async() => {
    gfc.importGeoFile('in.gpx')
    .then(async(fileInfo) => {
        console.log(fileInfo)
        const content = gfc.getContent()
    })
    .catch(e => {console.log(e)})
}

sample()

// From string
// Parsers parseGPX, parseKML, parseGeoJSON
const sample2 = async() => {
    gfc.parseGPX('<gpx-xml-string>')
    .then(async(c) => {
        const content = c
    })
    .catch(e => {console.log(e)})
}

sample2()

// Output
// output options -optional
let options = gfc.newExportOptions()

// To file
// Exports exportGPX, exportKML, exportGeoJSON
const sample3 = async() => {
    gfc.exportKML('out.kml',options)
    .then(async() => {
        console.log('Saved to disk')
    })
    .catch(e => {console.log(e)})
}

sample3()

// To string
// types gpx, kml, geojson
const sample3 = async() => {
    gfc.stringify('kml',options)
    .then(async(c) => {
        const content = c
    })
    .catch(e => {console.log(e)})
}

sample3()

// output options
/*
    onlyWaypoints: false,
    onlyTracks: false,
    optimizationLevel: optimizationLevel.lossless,
    useCompression: true,
    trailColors:[],
    waypointStyle: {}
*/
// optimizationLevel - lossless, low, medium, hard, aggressive
let options = gfc.newExportOptions()
options.optimizationLevel = gfc.optimizationLevel.hard