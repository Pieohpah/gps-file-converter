const xml_help = require('../helpers/xml')
const common = require('../helpers/common')
const jsscompress = require("js-string-compression")
const zip = new jsscompress.Hauffman()
const accuracy = 100000

const EnumGeoPoint =  {
    lat:0,
    lon:1,
    ele:2,
    time:3
}
const PGGeoPointModel = [] // [59.30275, 18.10375,10,null] lat, lon, elevation?, time?
const PGGeoWaypoint = {
    name:'',
    desc:'',
    point:'',
    type: '',

}
const PGGeoTrack = {
    name:'',
    desc:'',
    ordinal:0,
    points:[]
}
const PGGeoModel = {
    type:'pgt',
    version: '1.0.0',
    name: '',
    desc: '',
    link: {
        url:'',
        text:''
    },
    timestamp: '',
    waypoints:[],
    tracks:[]
}

const newGeoModel = () => {
    return common.deepCopy(PGGeoModel)
}
const newGeoPoint = (latitude, longitude, elevation, timestamp) => {
    let ret = []
    ret.push(parseFloat(latitude))
    ret.push(parseFloat(longitude))
    if(timestamp) {
        ret.push(elevation ? parseInt(elevation) : null)
        ret.push(parseInt(timestamp))
    } else {
        if(elevation) {
            ret.push(parseInt(elevation))
        }
    }
    return ret
}

const newGeoWaypoint = (name, desc, geopoint) => {
    let ret = common.deepCopy(PGGeoWaypoint)
    ret.name = name
    ret.desc = desc
    ret.point = geopoint
    return ret
}

const newGeoTrack = (name, desc, geopoints, ordinal) => {
    let ret = common.deepCopy(PGGeoTrack)
    ret.name = name
    ret.desc = desc || ''
    ret.ordinal = ordinal || 0
    ret.points = geopoints
    return ret
}

const PGGeoFromGPX = (gO) => {
    gO = gO.gpx
    let m = newGeoModel()
    m.name = gO.metadata.name
    m.desc = gO.metadata.desc
    if(gO.metadata.time) {
        m.timestamp = new Date(gO.metadata.time).getTime()
    } else {
        delete m.timestamp
    }
    
    if(gO.link) {
        m.link.url = gO.metadata.link['@_href']
        m.link.text = gO.metadata.link.text
    } else {
        delete m.link
    }
    
    // Waypoints
    if(gO.wpt){
        gO.wpt.forEach(e => {
            let p = newGeoPoint(e['@_lat'],e['@_lon'],e.ele,new Date(e.time).getTime())
            let wp = newGeoWaypoint(e.name,undefined,p)
            m.waypoints.push(wp)
        })
    } else {
        delete m.waypoints
    }

    // Tracks
    if(gO.trk) {
        let ord = 1
        gO.trk.forEach(trk => {
            let ts = newGeoTrack(trk.name, trk.desc, [], ord)
            //console.log({tr:trk})
            trk.trkseg.trkpt.forEach(t => {
                //console.log(t)
                let tr = newGeoPoint(t['@_lat'],t['@_lon'],t.ele)
                ts.points.push(tr)
            })
            m.tracks.push(ts)
            ord += 1
        })
        
    } else {
        delete m.tracks
    }

    return m
}

const PGGeoFromKML = (gO) => {
    gO = gO.kml.Document
    let m = newGeoModel()
    //console.log(gO)
    m.name = gO.Placemark.name
    m.desc = gO.Placemark.description
    delete m.timestamp
    
    // Waypoints 
    //TODO: later
    if(gO.wpt){
        gO.wpt.forEach(e => {
            let p = newGeoPoint(e['@_lat'],e['@_lon'],e.ele,new Date(e.time).getTime())
            let wp = newGeoWaypoint(e.name,undefined,p)
            m.waypoints.push(wp)
        })
    } else {
        delete m.waypoints
    }

    // Tracks
    if(gO.Placemark.LineString) {
        //console.log(gO.Placemark.LineString.coordinates)
        //TODO: forEach
        let ts = newGeoTrack(m.name, m.desc, [])
        gO.Placemark.LineString.coordinates.split('\n').forEach(t => {
            let tp = t.split(',')
            let tr = newGeoPoint(tp[0],tp[1],tp[2])
            ts.points.push(tr)
        })
        m.tracks.push(ts)
    } else {
        delete m.tracks
    }

    return m
}

const compressPointArray = (points) =>  {
    let ret = ''
    let first = undefined
    let latO = lonO = eleO = timeO = 0
    points.forEach(t => {
        //console.log(t)
        if(!first) {
            latO = t[EnumGeoPoint.lat]
            lonO = t[EnumGeoPoint.lon]
            eleO = t[EnumGeoPoint.ele]
            timeO = t[EnumGeoPoint.time]
            first = t
        } else {
            latO = Math.round((t[EnumGeoPoint.lat] - first[EnumGeoPoint.lat])*100000)
            lonO = Math.round((t[EnumGeoPoint.lon] - first[EnumGeoPoint.lon])*100000)
            if(first[EnumGeoPoint.ele]) {
                eleO = Math.round(t[EnumGeoPoint.ele] - first[EnumGeoPoint.ele])
            }
            if(first[EnumGeoPoint.time]) {
                timeO = Math.round(t[EnumGeoPoint.time] - first[EnumGeoPoint.time])
            } 
        }
        ret += `${latO},${lonO}`
        if(first[EnumGeoPoint.ele]) {
            ret += `,${eleO}`
            if(first[EnumGeoPoint.time]) {
                ret += `,${timeO}`
            }
        } else if(first[EnumGeoPoint.time]) {
            ret += `,undefined,${timeO}`
        }
        ret += '|'
       
    })
    const compressed = zip.compress(ret)
    let buff = Buffer.from(compressed);
    let base64data = buff.toString('base64');
    return base64data
}

const deCompressPointArray = (compressedPoints) =>  {
    let buff = Buffer.from(compressedPoints, 'base64');
    let compPoints = buff.toString();
    let ret = []
    const pointStr = zip.decompress(compPoints)
    const pointStrArr = pointStr.split('|')
    let first = undefined
    pointStrArr.forEach((ps) => {
        const pp = ps.split(',')
        let point = []
        if(!first){
            first = newGeoPoint(pp[EnumGeoPoint.lat],pp[EnumGeoPoint.lon],pp[EnumGeoPoint.ele],pp[EnumGeoPoint.time])
            point = first
        } else {
            let latO = Math.round( ((parseFloat(pp[EnumGeoPoint.lat])/accuracy) + first[EnumGeoPoint.lat])* accuracy) / accuracy
            let lonO = Math.round( ((parseFloat(pp[EnumGeoPoint.lon])/accuracy) + first[EnumGeoPoint.lon])* accuracy) / accuracy
            let eleO = parseInt(pp[EnumGeoPoint.ele]) + first[EnumGeoPoint.ele] || undefined  
            let timeO = parseInt(pp[EnumGeoPoint.time] + first[EnumGeoPoint.time])  || undefined 
            point = newGeoPoint(latO,lonO,eleO,timeO)
        }
        
        ret.push(point)
    })
    return ret
}

module.exports = {
    PGGeoFromGPX,
    PGGeoFromKML,
    newGeoModel,
    newGeoWaypoint,
    newGeoTrack,
    newGeoPoint,
    EnumGeoPoint,
    compressPointArray,
    deCompressPointArray
}

