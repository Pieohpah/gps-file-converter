# GPS File Converter

## About
gps-file-converter is a nodejs module that imports and exports geolocation files and strings.
gps-file-converter is asynchronous when needed.

Supported formats are .gpx, .kml and GeoJSON

## Installation

With [npm](https://www.npmjs.com/) do:

    $ npm install gps-file-converter

## Dependencies
- [fast-xml-parser](https://www.npmjs.com/package/fast-xml-parser)
- [adm-zip](https://www.npmjs.com/package/adm-zip)
- [js-string-compression](https://www.npmjs.com/package/js-string-compression) 

## Basic usage
Create an instance 

```javascript
const GFC = require('gps-file-converter')
const gfc = new GFC()
```
Then give it some input with in.gpx, a file of your choise...

```javascript
gfc.importGeoFile('in.gpx')
.then(async(fileInfo) => {
    console.log(fileInfo)
    const content = gfc.getContent()
})
.catch(e => {console.log(e)})
```

Then you can for example export it as a .kml-file, out.kml

```javascript
gfc.exportKML('out.kml')
.then(async() => {
    console.log('Saved to disk')
})
.catch(e => {console.log(e)})
```

## Documentation
- [Input methods](https://github.com/Pieohpah/gps-file-converter/blob/main/docs/input.md)
- [Output methods](https://github.com/Pieohpah/gps-file-converter/blob/main/docs/output.md)
- [Export options](https://github.com/Pieohpah/gps-file-converter/blob/main/docs/options.md)

## Disclaimer
gps-file-converter only supports waypoints, tracks and metadata concerning that.
In kml-files the Placemark has to be directly on the map or in the first Folder.