const fs = require('fs').promises
const { XMLParser, XMLBuilder, XMLValidator} = require('fast-xml-parser')
const mod = require('./models/PGGeoModel')
const transPgt = require('./translators/translatePgt')
const admzip = require('adm-zip')
const path = require('path')

let content = {}

const importFile = async (filePath, handler) => {
    return new Promise((resolve, reject) =>{
        //console.log(filePath)
        getFileContent(filePath)
        .then(c => {
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
    
    // Garmin GPX files
    importGPX = async (filePath) => {
        return importFile(filePath,this.parseGPX)
    }
    parseGPX = async(str) => {
        return new Promise((resolve, reject) =>{
            const options = {
                ignoreAttributes : false
            }
            const parser = new XMLParser(options)
            //TODO: translate gpx to pggeo before adding to content
            var gspContent = parser.parse(str)
            if(gspContent) {
                content = mod.PGGeoFromGPX(gspContent)

            } else {
                return reject('Data could not be parsed')
            }
            return resolve(content)
        })
    }

    // Google KLM files
    importKML = (filePath) => {
        console.log(filePath)
    }

    // PlaceGaze files
    importPGT = (filePath) => {
        console.log(filePath)
    }
    importPGTZ = (filePath) => {
        console.log(filePath)
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

}


module.exports = PGGeo