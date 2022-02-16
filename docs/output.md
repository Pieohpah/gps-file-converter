# GPS File Converter

## Output methods
You can output geo data in two ways: To file or to string.

- exportGPX, exportKML, exportGeoJSON: exports geo data to a file on disk
- stringify: outputs a string of the content of the corresponding format

### Examples

```javascript
gfc.exportKML(filePath, options)
.then(async() => {
    console.log('Saved to disk')
})
.catch(e => {console.log(e)})
```

```javascript
gfc.stringify(type, options)
.then(async(c) => {
    const content = c
})
.catch(e => {console.log(e)})
```
## Parameters
- filePath: path with filename of the exported geo data
- options: ( *Optional* ) Read more [here](options.md)
- type: can be 'gpx', 'kml' or 'json'
