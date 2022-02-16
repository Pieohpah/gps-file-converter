# GPS File Converter

## Input methods
You can input geo data in two ways: By file or string.

- importGeoFile: imports a file from disk
- parseGPX, parseKML, parseGeoJSON: inputs a string of the content of the corresponding format

### Examples

```javascript
gfc.importGeoFile(filePath)
.then(async(fileInfo) => {
    console.log(fileInfo)
    const content = gfc.getContent()
})
.catch(e => {console.log(e)})
```

```javascript
gfc.parseGPX(geoDataString)
.then(async(c) => {
    const content = c
})
.catch(e => {console.log(e)})
```

## Parameters
- filePath: path with filename of the file to import
- geoDataString: a string with XML or JSON depending on format, ie. gpx and kml is XML