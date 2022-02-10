const common = require('../helpers/common') 
const config = require('../config')


const KmlModel = {
    '?xml':'',
    kml: {
        Document: {
            name: '',
            Style: {
            },
            Placemark: {
                name: '',
                description: '',
                styleUrl: '',
                LineString: {
                    coordinates: ''
                }
            }
        }
    }
}


const newKmlModel = () => {
    let ret = common.deepCopy(KmlModel)
    const meta = config.kml
    //console.log(meta)
    Object.keys(meta).forEach(key => {
        ret.kml[`@_${key}`] = meta[key]
    })

    return ret
}

module.exports = {
    newKmlModel
}