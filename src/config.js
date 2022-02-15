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

const kml_meta = {
    default: {
        LineStyleId: 'lineStyle',
        LineStyle: {
            color: '99FF00',
            width: 4
        }
    }
}

const config = {
    program:{
        name: 'gps-file-converter',
        version: '1.0.0'
    },
    gpx: gpx_meta,
    kml: kml_meta
}

module.exports = config