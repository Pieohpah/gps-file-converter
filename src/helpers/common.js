const crypto = require('crypto')
const Readable = require('stream').Readable

const deepCopy = (obj) => {
    let ret = JSON.parse(JSON.stringify(obj))
    return ret
}

const zeroFill = (num, pos) => {
    let ret = ''
    var s = num.toString()
    var arr = s.split('')
    var diff = pos - arr.length
    for(var p=0;p<diff;p++){
        arr.unshift('0')
    }
    ret = arr.join('')
    return ret
}

const getFileHash =  (fileStr) => {
    return new Promise((resolve,reject) => {
        try {
            const output = crypto.createHash('md5')
            const fileStream = new Readable();
            fileStream._read = () => {}
            fileStream.push(fileStr);
            fileStream.push(null)
            output.once('readable', () => {
              return resolve(output.read().toString('hex'))
            })
            fileStream.pipe(output)
        } catch (e) {
            return reject(e)
        }
    })     
}

const asyncForEach = async (array, handlerfunction) => {
    return new Promise(async (resolve,reject) => {
      //console.log('asyncForEach')
      if(array) {
        for (let index = 0; index < array.length; index++) {
            await handlerfunction(array[index], index, array)
            if(index === array.length -1) {
                //console.log('resolve at index ' + index)
                return resolve()
            }
        }
      } else {
        return reject(`asyncForEach got no array`)
      } 
    })
  }

module.exports = {
    deepCopy,
    zeroFill,
    getFileHash,
    asyncForEach
}
