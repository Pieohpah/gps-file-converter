const gpx_meta = {
    gpx_version: '1.1',
    creator:"PlaceGaze - http://www.placegaze.com",
    xmlns:"http://www.topografix.com/GPX/1/1",
    xmlns_xsi:"http://www.w3.org/2001/XMLSchema-instance",
    xsi_schemaLocation:"http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd",
    xmlns_gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1",
    xmlns_gpxx:"http://www.garmin.com/xmlschemas/GpxExtensions/v3",
    targetNamespace:"http://www.topografix.com/GPX/1/1",
    elementFormDefault:"qualified"
}


const config = {
    program:{
        
    },
    gpx: gpx_meta
}

module.exports = config