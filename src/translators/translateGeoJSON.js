const common = require('../helpers/common')
const pgmodel = require('../models/PGGeoModel')

const dataFromModel = (model, options) => {
    if(!options) {
        options = mod.newExportOptions()
    }
    let ret = {
        type: 'FeatureCollection'
    }
    let features = []
    if(model.waypoints && !options.onlyTracks) {
        model.waypoints.forEach(wp => {
            let w = {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [wp.point[1],wp.point[0]]
                },
                properties: {
                    name: wp.name,
                    desc: wp.desc
                }
            }
            features.push(w)
        })
    }
    if(model.tracks && !options.onlyWaypoints) {
        model.tracks.forEach(tr => {
            let tf = {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                },
                properties: {
                    name: tr.name,
                    desc: tr.desc
                }
            }
            let coordinates = []
                tr.points.forEach(p => {
                    let np = [p[1],p[0]]
                    coordinates.push(np)
                })
                tf.geometry.coordinates = coordinates
                features.push(tf)

            
            })
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
                    const coord = f.geometry.coordinates[0]
                    let p = pgmodel.newGeoPoint(coord[0], coord[1])
                    let wp = pgmodel.newGeoWaypoint(JSON.stringify(f.properties),'',p)
                    content.waypoints.push(wp)
                }
                if(f.geometry && f.geometry.type === 'LineString') {
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