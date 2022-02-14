const GFC = require('./gps-file-converter')
const geo = new GFC()
const model = require('./src/models/PGGeoModel')
const gpxmod = require('./src/models/GPXModel')
const tpg = require('./src/translators/translatePgt')
const ft = require('./src/helpers/fileinfo')
const common = require('./src/helpers/common')

const xmlTool = require('./src/helpers/xml')

const t = async() => {
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

    geo.importGeoFile('./Files/Tallborgen.gpx') // eller pg.parseGPX om man har strängen ./Files/S.gpx ./Files/out/ralle2.pgt
    .then(async(c) => {
        console.log(c)
        //console.log(await geo.stringify('gpx'))
        //let tps = pg.getContent().tracks.points
        //let pgt = tpg.pgtFromModel(pg.getContent(),true)
        console.log(geo.getContent())
        //geo.exportPGT('./Files/out/tall.pgt')
        geo.exportGPX('./Files/out/tall.gpx')
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

