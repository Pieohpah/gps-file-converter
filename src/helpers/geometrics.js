const common = require('./common')

Number.prototype.compassValue = function() {
    var ret = parseFloat(this) % 360.0
    if(ret < 0) {
        ret = 360.0 + this
    }
    return ret
}

Number.prototype.radianValue = function() {
    return parseFloat(this) * Math.PI / 180.0
}

Number.prototype.degreeValue = function() {
    return parseFloat(this) * 180.0 / Math.PI
}

const coordinate = {
    latitude: 0.0,
    longitude: 0.0
}

const newCoordinate = (lat,lon) => {
    let ret = common.deepCopy(coordinate)
    ret.latitude = lat
    ret.longitude = lon
    return ret
}

const bearing = (fromCoord, toCoord) => {
    const x = Math.cos(toCoord.latitude.radianValue()) * Math.sin((toCoord.longitude - fromCoord.longitude).radianValue())
    const y = Math.cos(fromCoord.latitude.radianValue()) * Math.sin(toCoord.latitude.radianValue()) - Math.sin(fromCoord.latitude.radianValue()) * Math.cos(toCoord.latitude.radianValue()) * Math.cos((toCoord.longitude - fromCoord.longitude).radianValue())
    const bearing = Math.atan2(x,y) * 180.0 / Math.PI
    return bearing

}
const bearingDiff = (b1,b2) => {
    ret = 0
    if(b1>b2) {
        ret = b1-b2
    } else {
        ret = b2-b1
    }
    if(ret > 180.0) {
       ret = ret - 180.0
    }
    return ret
}

// https://www.movable-type.co.uk/scripts/latlong.html
/*
This uses the ‘haversine’ formula to calculate the great-circle distance between two points – that is, the shortest distance over the earth’s surface – giving an ‘as-the-crow-flies’ distance between the points (ignoring any hills they fly over, of course!)
*/
const distanceMeters = (fromCoord, toCoord) => {
    const lat1 = fromCoord.latitude.radianValue()
    const lon1 = fromCoord.longitude.radianValue()
    const lat2 = toCoord.latitude.radianValue()
    const lon2 = toCoord.longitude.radianValue()

    const R = 6371e3 // metres
    const φ1 = lat1 * Math.PI/180 // φ, λ in radians
    const φ2 = lat2 * Math.PI/180
    const Δφ = (lat2-lat1) * Math.PI/180
    const Δλ = (lon2-lon1) * Math.PI/180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    const d = R * c // in metres
    return d
}

module.exports = {
    newCoordinate,
    bearing,
    bearingDiff,
    distanceMeters
}