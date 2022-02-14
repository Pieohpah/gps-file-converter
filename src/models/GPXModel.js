const common = require('../helpers/common') 
const config = require('../config')

const GpxTrack = {
    name:'',
    desc:'',
    trkseg: {
        trkpt: []
    }
}

const GpxTrackPoint = {
        ele:''
}
const GpxLink = {
    text:''
}

const GpxWayPoint = {
    ele:'',
    time:'',
    name: '',
    sym:'' 
}

const GpxModel = {
    '?xml':'',
    gpx: {
        metadata: {
            name:'',
            desc:'',
            link:{},
            time:''
        },
        trk: [],
        wpt:[]
    }
}

const newGpxModel = () => {
    let ret = common.deepCopy(GpxModel)
    const meta = config.gpx
    Object.keys(meta).forEach(key => {
        ret.gpx[`@_${key}`] = meta[key]
    })

    return ret
}

const newTrackPoint = (lat, lon, ele) => {
    let pt = common.deepCopy(GpxTrackPoint)
    pt['@_lat'] = lat
    pt['@_lon'] = lon

    if(ele) {
        pt.ele = ele
    } else {
        delete pt.ele
    }
    return pt
}

const newTrack = (name, desc, points) => {
    let ret = common.deepCopy(GpxTrack)
    ret.name = name
    ret.desc = desc
    ret.trkseg.trkpt = points

    return ret
}

const newWayPoint = (lat, lon, ele, name, time, sym) => {
    if(!sym) {
        sym = 'Flag, Orange'
    }
    let ret = common.deepCopy(GpxWayPoint)
    ret['@_lat'] = lat
    ret['@_lon'] = lon
    ret.ele = ele
    ret.name = name
    ret.time = time
    ret.sym = sym

    return ret
}

const newLink = (url, text) => {
    let ret = common.deepCopy(GpxLink)
    ret['@_href'] = url
    ret.text = text
    return ret
}

const toXML = (model) => {
    return common.XMLFromObj(model)
}

module.exports = {
    newGpxModel,
    newTrackPoint,
    newWayPoint,
    newTrack,
    newLink,
    toXML
}