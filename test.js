const GFC = require('./gps-file-converter')
const geo = new GFC()
const model = require('./src/models/PGGeoModel')
const tpg = require('./src/translators/translatePgt')
const ft = require('./src/helpers/fileinfo')

const xmlTool = require('./src/helpers/xml')

const t = async() => {
    //let s = xmlTool.commentString('Kalle Koala')
    //console.log(s)
    //s = xmlTool.deCommentString(s)
    //console.log(s)

    geo.importGeoFile('./Files/out/bike.zip') // eller pg.parseGPX om man har strängen ./Files/S.gpx ./Files/out/ralle2.pgt
    .then(async(c) => {
        console.log(c)
        //console.log(geo.getDataType())
        //let tps = pg.getContent().tracks.points
        //let pgt = tpg.pgtFromModel(pg.getContent(),true)
        //console.log(pgt)
        geo.exportPGTZ('./Files/out/bike.zip')
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

