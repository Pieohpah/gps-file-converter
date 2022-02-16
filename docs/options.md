# GPS File Converter

## Export options

The exportOptions-object can be passed to the parse- and export-functions.
If no options-object is passed the default values will be applied.

To create it:

```javascript
let options = gfc.newExportOptions()
```

## Parameters
- onlyWaypoints: true/false, default is false
- onlyTracks: true/false, default is false
- optimizationLevel: default is optimizationLevel.lossless,
- useCompression: true/false, default is true
- trailColors: default is [] *Not implemented*
- waypointStyle: default is {} *Not implemented*

### optimizationLevel
The level of optimization of the tracks point list.
If set to *lossless* all points are exported, otherwise a thinning of the points is done with increasing distance between points. The optimization level can greatly affect the file size of the export.  

optimizationLevel can have these values:

- lossless
- low
- medium
- high
- aggressive

You can set the level like this:

```javascript
options.optimizationLevel = gfc.optimizationLevel.medium
```
