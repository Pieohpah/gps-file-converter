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
/*
    let m = gpxmod.newGpxModel()
    let tp = gpxmod.newTrackPoint(59.73,18.56,10)
    let l = gpxmod.newLink('http://www.garmin.com', 'Garmin International')
    let wp = gpxmod.newWayPoint(59.346936, 18.050696,8.835917,'Snitz')
    let wp2 = gpxmod.newWayPoint(59.346936, 18.050696,8.835917,'Kalle')
    m.gpx.metadata.link = l
    m.gpx.trk.trkseg.push(tp)
    m.gpx.wp.push(wp)
    m.gpx.wp.push(wp2)
    console.log(common.XMLFromObj(m))

    return
    */
    //let s = xmlTool.commentString('Kalle Koala')
    //console.log(s)
    //s = xmlTool.deCommentString(s)
    //console.log(s)

    geo.importGeoFile('./Files/out/tall2.pgt','./Files/TrackNWaypointGpx.gpx') // eller pg.parseGPX om man har strängen ./Files/S.gpx ./Files/out/ralle2.pgt
    .then(async(c) => {
        console.log(c)
        let options = model.newExportOptions()
        //options.optimizationLevel = model.optimizationLevel.hard
        //console.log(
            //await geo.stringify('gpx',options)
            //)
        //console.log(await geo.stringify('gpx'))
        //let tps = pg.getContent().tracks.points
        //let pgt = tpg.pgtFromModel(pg.getContent(),true)
        //console.log(geo.getContent())
        //let ps = model.optimizePointArray(geo.getContent().tracks[0].points,1)
        //console.log({ps})
        //geo.exportPGT('./Files/out/tall.pgt')
       geo.exportGPX('./Files/out/tall3.gpx',options)
        //geo.exportKML('./Files/out/tall.kml')
        /*
        let compressed = model.compressPointArray(tps)
        //console.log(compressed)
        let dec = model.deCompressPointArray(compressed)
        console.log(dec)
        */
    })
    .catch(e => {console.log(e)})
}
t()

