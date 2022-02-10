const common = require('../helpers/common')
const pgmodel = require('../models/PGGeoModel')

const dataFromModel = (model) => {
    //console.log({model})
    let ret = {
        type: 'FeatureCollection'
    }
    let features = []
    if(model.waypoints) {
        model.waypoints.forEach(wp => {
            //console.log(wp)
            let w = {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [wp.point[0],wp.point[1]]
                },
                properties: {
                    name: wp.name,
                    desc: wp.desc
                }
            }
            //console.log(w)
            features.push(w)
        })
    }
    if(model.tracks) {
        let tf = {
            type: 'Feature',
            geometry: {
                type: 'LineString',
            },
            properties: {
                name: model.tracks.name,
                desc: model.tracks.desc
            }
        }
        let coordinates = []
        model.tracks.points.forEach(p => {
            let np = [p[1],p[0]]
            coordinates.push(np)
        })
        tf.geometry.coordinates = coordinates
        features.push(tf)
    }
    ret.features = features

    return JSON.stringify(ret)
}

const parseData = async(data) => {
    return new Promise((resolve, reject) =>{
        let gpsContent = undefined
        if(typeof data === 'string'){
            const options = {
                ignoreAttributes : false
            }
            gpsContent = JSON.parse(data)
        } else {
            gpsContent = data
        }
        if(gpsContent) {
            let content = pgmodel.newGeoModel()
            gpsContent.features.forEach(f => {
                if(f.geometry && f.geometry.type === 'Point') {
                    console.log('Create waypoint')
                    const coord = f.geometry.coordinates[0]
                    let p = pgmodel.newGeoPoint(coord[0], coord[1])
                    let wp = pgmodel.newGeoWaypoint(JSON.stringify(f.properties),'',p)
                    content.waypoints.push(wp)
                }
                if(f.geometry && f.geometry.type === 'LineString') {
                    console.log('Create track')
                    const coords = f.geometry.coordinates
                    let points = []
                    coords.forEach(p => {
                        points.push(pgmodel.newGeoPoint(p[0],p[1]))
                    })
                    let tl = pgmodel.newGeoTrack(JSON.stringify(f.properties),'',points)
                    content.tracks.push(tl)
                }
            })   
                      
            return resolve(content)
        }  else {
            return reject('Data could not be parsed')
        }  
    })
}

module.exports = {
    dataFromModel,
    parseData,
}