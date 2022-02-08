const gpx_meta = {
    gpx_version: '1.1',
    creator:"PlaceGaze - http://www.placegaze.com",
    xmlns:"http://www.topografix.com/GPX/1/1",
    xmlns_xsi:"http://www.w3.org/2001/XMLSchema-instance",
    xsi_schemaLocation:"http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd",
    xmlns_gpxtpx:"http://www.garmin.com/xmlschemas/TrackPointExtension/v1",
    xmlns_gpxx:"http://www.garmin.com/xmlschemas/GpxExtensions/v3",
    targetNamespace:"http://www.topografix.com/GPX/1/1",
    elementFormDefault:"qualified"
}


const config = {
    program:{
        name: 'gps-file-converter',
        version: '1.0.0'
    },
    gpx: gpx_meta,
    filetypes: {
        gpx:{
            ext:'gpx',
            desc: 'GPS Exchange Format'
        },
        kml: {
            ext:'kml',
            desc: 'Keyhole Markup Language'
        },
        pgt: {
            ext:'pgt',
            desc: 'PlaceGaze Trails'
        },
        geojson: {
            ext:'json',
            desc: 'GeoJSON'
        },
        zip: {
            ext: 'zip',
            desc: 'Zip Archive'
        }
    }
}

module.exports = config