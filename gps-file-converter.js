const fs = require('fs').promises
const transGpx = require('./src/translators/translateGpx')
const transPgt = require('./src/translators/translatePgt')
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
            filetype = fi.lookupFileType(c)
            handler(c).then(() => {
                return resolve()
            })
        })
        .catch(e => {return reject(e)})
    })
}

getFileContent = async (filePath) => {
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
                const fileinfo = fi.getFileData(c)
                filetype = {
                    ext: fileinfo.ext,
                    desc: fileinfo.desc,
                    format:fileinfo.format,
                }
                console.log(filetype)
                let handler = undefined

                switch(fileinfo.ext) {
                    case 'gpx': handler = this.parseGPX
                        break
                    case 'pgt': handler = this.parsePGT
                        break
                    case 'zip': handler = this.parsePGTZ  
                        break  
                    default:
                        return reject(`No handler available for filetype ${fileinfo.ext}`)
                        
                }
                handler(fileinfo.data).then(() => {
                    return resolve({
                        ...filetype,
                        filename_ext: filename_extension
                    })
                })
            })
            .catch(e => {return reject(e)})
        })
        
    }
    
    // Garmin GPX files
    importGPX = async (filePath) => {
        return importFile(filePath,this.parseGPX)
    }
    parseGPX = async(str) => {
        transGpx.parseGPX(str)
        .then(data => {
            content = data
        })
    }

    // Google KLM files
    importKML = (filePath) => {
        console.log(filePath)
    }

    // PlaceGaze files
    importPGT = (filePath) => {
        //console.log(filePath)
        return importFile(filePath,this.parsePGT)
    }
    importPGTZ = (filePath) => {
        console.log(filePath)
    }
    parsePGT = async(str) => {
        return transPgt.parsePGT(str)
    }
    parsePGTZ = async(str) => {
        return transPgt.parsePGTZ(str)
    }

    exportPGT = (filePath) => {
        let c = transPgt.pgtFromModel(content,true)
        return exportFile(filePath,c)
    }
    exportPGTZ = (filePath) => {
        let fname = path.basename(filePath.toLowerCase(),'.zip') + '.pgt'
        let c = transPgt.pgtFromModel(content,true)
        return exportFileCompressed(filePath,fname,c)
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