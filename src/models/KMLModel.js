const common = require('../helpers/common') 
const xml = require('../helpers/xml')
const config = require('../config')

const waypointStyleHeader = {
    IconStyle: {
        scale: 1.0,
        Icon: {
            href:'https://www.gstatic.com/mapspro/images/stock/93-parkinglot.png'
        }
    },
    LabelStyle: {
        scale: 0,
    }
}

const waypointStyleMapPair = {
    key:'',
    styleUrl:''
}

const styleMapHeader = {
    StyleMap: [],
    Style: []
}

const trackStyleHeader = {
    LineStyle: {
        color:'',
        width: 4
    }
}


const KMLTrack = {
    name: '',
    description: '',
    styleUrl: '',
    LineString: {
        coordinates: ''
    }
}

const KMLWaypoiny = {
    name: '',
    description: '',
    styleUrl: '',
    Point: {
        coordinates: ''
    }
}

const KmlModel = {
    '?xml':'',
    kml: {
        Document: {
            name: '',
            StyleMap: [],
            Style: [],
            Placemark: []
        }
    }
}

const newWaypointStyle = (id) => {
    let ret = common.deepCopy(styleMapHeader)
    let sm = {}
    sm['@_id'] = id
    let kp = common.deepCopy(waypointStyleMapPair)
    kp.key = 'normal'
    kp.styleUrl = `${id}-normal`
    sm.Pair =[]
    sm.Pair.push(kp)
    kp = common.deepCopy(waypointStyleMapPair)
    kp.key = 'highlight'
    kp.styleUrl = `${id}-highlight`
    sm.Pair.push(kp)
    ret.StyleMap.push(sm)

    let s1 = common.deepCopy(waypointStyleHeader)
    s1['@_id'] = `${id}-normal`
    ret.Style.push(s1)
    let s2 = common.deepCopy(waypointStyleHeader)
    s2['@_id'] = `${id}-highlight`
    ret.Style.push(s2)

    return ret
}

const newTrackStyle = (id, color, width) => {
    if(!color) {
        color = config.kml.default.LineStyle.color
    }
    if(!width) {
        width = config.kml.default.LineStyle.width
    }
    var ret = common.deepCopy(styleMapHeader)
    let sm = {}
    sm['@_id'] = id
    let kp = common.deepCopy(waypointStyleMapPair)
    kp.key = 'normal'
    kp.styleUrl = `${id}-normal`
    sm.Pair =[]
    sm.Pair.push(kp)
    kp = common.deepCopy(waypointStyleMapPair)
    kp.key = 'highlight'
    kp.styleUrl = `${id}-highlight`
    sm.Pair.push(kp)
    ret.StyleMap.push(sm)

    let s1 = common.deepCopy(trackStyleHeader)
    s1['@_id'] = `${id}-normal`
    s1.LineStyle.color = color
    s1.LineStyle.width = width
    ret.Style.push(s1)
    let s2 = common.deepCopy(trackStyleHeader)
    s2['@_id'] = `${id}-highlight`
    s2.LineStyle.color = color
    s2.LineStyle.width = width
    ret.Style.push(s2)

    return ret
}

const newKMLTrack = (name, desc, points,  styleId) => {
    if(!styleId) {
        styleId = config.kml.default.LineStyleId
    }
    let ret = common.deepCopy(KMLTrack)
    ret.name = xml.commentString(name)
    ret.description = xml.commentString(desc)
    ret.styleUrl = `#${styleId}`
    let pointStr= ''
    points.forEach(p => {
        pointStr += `${p[1]},${p[0]},${p[2] || 0}\n`
    })
    ret.LineString.coordinates = pointStr

    return ret
}

const newKMLWaypoint = (name, desc, point, styleId) => {
    if(!styleId) {
        styleId = config.kml.default.LineStyleId
    }
    let ret = common.deepCopy(KMLWaypoiny)
    ret.name = xml.commentString(name)
    ret.description = xml.commentString(desc)
    ret.styleUrl = `#${styleId}`
    let pointStr = `${point[1]},${point[0]},${point[2] || 0}\n`

    ret.Point.coordinates = pointStr

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
    newKMLTrack,
    newKMLWaypoint,
    newWaypointStyle,
    newTrackStyle
}