const common = require('../helpers/common') 
const xml = require('../helpers/xml')
const config = require('../config')

const KMLPlacemark = {
    name: '',
    description: '',
    styleUrl: '',
    LineString: {
        coordinates: ''
    }
}

const KmlModel = {
    '?xml':'',
    kml: {
        Document: {
            name: '',
            Style: {
            },
            Placemark: {}
        }
    }
}

const newKMLPlacemark = (name, desc, points) => {
    let ret = common.deepCopy(KMLPlacemark)
    ret.name = xml.commentString(name)
    ret.description = xml.commentString(desc)
    ret.styleUrl = `#${config.kml.default.LineStyleId}`
    let pointStr= ''
    points.forEach(p => {
        pointStr += `${p[1]},${p[0]},${p[2] || 0}\n`
    })
    ret.LineString.coordinates = pointStr

    return ret
}


const newKmlModel = () => {
    let ret = common.deepCopy(KmlModel)
    const meta = config.kml
    //console.log(meta)
    /*Object.keys(meta).forEach(key => {
        ret.kml[`@_${key}`] = meta[key]
    })*/

    return ret
}

module.exports = {
    newKmlModel,
    newKMLPlacemark
}