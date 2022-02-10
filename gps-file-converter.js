const fs = require('fs').promises
const transGpx = require('./src/translators/translateGpx')
const transPgt = require('./src/translators/translatePgt')
const transKml = require('./src/translators/translateKml')
const transGeo = require('./src/translators/translateGeoJSON')
const admzip = require('adm-zip')
const path = require('path')
const fi = require('./src/helpers/fileinfo')

let content = {}
let filetype = {}
let filename_extension = ''

const importFile = async (filePath, handler) => {
    return new Promise((resolve, reject) =>{
        //console.log(filePath)
        filename_extension = path.extname(filePath)
        getFileContent(filePath)
        .then(c => {
            filetype = fi.getFileData(c, filename_extension)
            handler(c).then(() => {
                return resolve()
            })
        })
        .catch(e => {return reject(e)})
    })
}

const getFileContent = async (filePath) => {
    return new Promise((resolve, reject) =>{
        fs.readFile(filePath)
        .then((c) => {
            return resolve(c.toString())
        })
        .catch((e) => {return reject(e)})
    })
}

const exportFile = async (filePath, contents) => {
    return new Promise((resolve, reject) =>{
        //console.log(filePath)
        fs.writeFile(filePath,contents)
        .then(c => {
            return resolve()
        })
        .catch(e => {return reject(e)})
    })
}
const exportFileCompressed = async (filePath, filename, contentString) => {
    const zip = new admzip()
	zip.addFile(filename, Buffer.from(contentString))
	const zipContent = zip.toBuffer()
    return exportFile(filePath,zipContent)
}

class PGGeo {
    constructor() {
    }
    // General
    importGeoFile = async (filePath) => {
        return new Promise((resolve,reject) => {
            filename_extension = path.extname(filePath)
            getFileContent(filePath)
            .then(c => {
                const fileinfo = fi.getFileData(c, filename_extension)
                filetype = {
                    ext: fileinfo.ext,
                    desc: fileinfo.desc,
                    format:fileinfo.format,
                }
                //console.log(filetype)
                let handler = undefined

                switch(fileinfo.ext) {
                    case 'gpx': handler = this.parseGPX
                        break
                    case 'kml': handler = this.parseKML
                        break
                    case 'pgt': handler = this.parsePGT
                        break
                    case 'pgtz':
                    case 'zip': handler = this.parsePGTZ  
                        break
                    case 'json': handler = this.parseGeoJSON
                        break  
                    default:
                        return reject(`No handler available for filetype ${fileinfo.ext}`)
                        
                }
                return handler(fileinfo.data).then(() => {
                    return resolve({
                        ...filetype,
                        filename_ext: filename_extension
                    })
                })
            })
            .catch(e => {return reject(e)})
        })
    }

    stringify = async (type) => {
        return new Promise((resolve, reject) => {
            let handler = undefined
            switch(type) {
                case 'gpx': handler = transGpx || undefined
                    break
                case 'kml': handler = transKml || undefined
                    break
                case 'pgt': handler = transPgt || undefined
                    break
                case 'json': handler = transGeo || undefined
                    break  
                default:
                    return reject(`No handler available for stringify to format '${type}'`)    
            }
            if(handler && handler.dataFromModel){
                const data = handler.dataFromModel(content)
                return resolve(data)
            } 
            return reject(`Handler for stringify to format '${type}' not implemented`)
        })   
    }
    
    // Garmin GPX files
    importGPX = async (filePath) => {
        return importFile(filePath,this.parseGPX)
    }
    parseGPX = async (data) => {
        return transGpx.parseData(data)
        .then(d => {
            content = d
        })
    }
    exportGPX = (filePath) => {
        let c = transGpx.dataFromModel(content)
        return exportFile(filePath, c)
    }

    // Google KLM files
    importKML = (filePath) => {
        return importFile(filePath,this.parseKML)
    }

    parseKML = async (data) => {
        return transKml.parseData(data)
        .then(d => {
            content = d
        })
    }
    exportKML = (filePath) => {
        let c = transKml.dataFromModel(content)
        return exportFile(filePath, c)
    }

    // GeoJSON
    importGeoJSON = (filePath) => {
        return importFile(filePath,this.parseGeoJSON)
    }

    parseGeoJSON = async (data) => {
        return transGeo.parseData(data)
        .then(d => {
            content = d
        })
    }

    exportGeoJSON = (filePath) => {
        let c = transGeo.dataFromModel(content)
        return exportFile(filePath, c)
    }

    // PlaceGaze files
    importPGT = (filePath) => {
        //console.log(filePath)
        return importFile(filePath,this.parsePGT)
    }
    importPGTZ = (filePath) => {
        console.log(filePath)
    }
    parsePGT = async(data) => {
        return transPgt.parseData(data)
        .then(d => {
            content = d
        })
    }
    parsePGTZ = async(data) => {
        return transPgt.parsePGTZ(data)
        .then(d => {
            content = d
        })
    }

    exportPGT = (filePath) => {
        let c = transPgt.dataFromModel(content, true)
        return exportFile(filePath, c)
    }
    exportPGTZ = (filePath) => {
        let fname = path.basename(filePath.toLowerCase(),'.zip') + '.pgt'
        let c = transPgt.dataFromModel(content, true)
        return exportFileCompressed(filePath, fname, c)
    }
    
    getContent = () => {
        return content
    }

    getDataType = () => {
        return {
            ...filetype,
            filename_ext: filename_extension
        }
    }
}


module.exports = PGGeo