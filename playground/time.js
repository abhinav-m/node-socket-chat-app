// Jan 1st 1970 00:00:00 am Unix epoch
//Evey date.time() is milliseconds elapsed from this point of time -> positive if ahead of this Date
//negative if past this date.
// eg -1000(1 second) will be Dec 31st 1970 11:59:59
const moment = require("moment");

const date = moment();
console.log(date.format("h:mm a"));

moment.valueOf(); //returns timestamp
moment.
