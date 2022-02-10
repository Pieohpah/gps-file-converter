const {zeroFill} = require('./common')

const diffInSeconds = (date1, date2) => {
    if(typeof date1 === 'object' &&  date1 instanceof Date) {
      date1 = date1.getTime()
    }
    if(typeof date2 === 'object' &&  date2 instanceof Date) {
      date2 = date2.getTime()
    } 
    return date1-date2
}

const parseDate = (date) => {
    if(typeof date === 'number') {
      date = new Date(date)
    }
    var zM = zeroFill(date.getMonth() + 1,2)
    var zD = zeroFill(date.getDate(),2)
    var zH = zeroFill(date.getHours(),2)
    var zMi = zeroFill(date.getMinutes(),2)
    var zS = zeroFill(date.getSeconds(),2)
    var zZH = zeroFill((date.getUTCHours()),2)
    return {
      timestamp: date.getTime(),
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hours: date.getHours(),
      minutes : date.getMinutes(),
      seconds: date.getSeconds(),
      datestring: `${date.getFullYear()}-${zM}-${zD}`,
      datetimestring: `${date.getFullYear()}-${zM}-${zD} ${zH}:${zMi}`,
      fullstring: `${date.getFullYear()}-${zM}-${zD} ${zH}:${zMi}:${zS}`,
      timestring: `${zH}:${zMi}`,
      fulltimestring: `${zH}:${zMi}:${zS}`,
      timezoneoffset: date.getTimezoneOffset()/60,
      gpzdate: `${date.getFullYear()}-${zM}-${zD}T${zZH}:${zMi}:${zS}Z`,
      gpztime: `${zH}${zMi}${zS}`
    }
  }


module.exports = {
    diffInSeconds,
    parseDate
}