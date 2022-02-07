const PGGeo = require('./PGGeo')
const pg = new PGGeo()
const model = require('./models/PGGeoModel')
const tpg = require('./translators/translatePgt')

const xmlTool = require('./helpers/xml')

const t = () => {
    let s = xmlTool.commentString('Kalle Koala')
    //console.log(s)
    s = xmlTool.deCommentString(s)
    //console.log(s)

    pg.importGPX('./Files/SW.gpx') // eller pg.parseGPX om man har strängen
    .then((c) => {
        //console.log(pg.getContent())
        //let tps = pg.getContent().tracks.points
        //let pgt = tpg.pgtFromModel(pg.getContent(),true)
        //console.log(pgt)
        pg.exportPGTZ('./Files/out/ralle2.zip')
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

