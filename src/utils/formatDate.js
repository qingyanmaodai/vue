// 当前日期，格式年月日
function formatTime() {
    let date = new Date();
    let year = date.getFullYear();
    let month = zero(date.getMonth() + 1);
    let day = zero(date.getDate());
    let hh = zero(date.getHours());
    let mm = zero(date.getMinutes());
    let ss = zero(date.getSeconds());
    return year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
}
// 小于10前面补0
function zero(num) {
    if (Number(num) < 10) {
        return '0' + num
    }
    else {
        return num
    }
}
// 当前日期，格式年月日
function formatTodayDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = zero(date.getMonth() + 1);
    let day = zero(date.getDate());
    return year + "-" + month + "-" + day;
}
// 当前日期前一天，格式年月日
function formatOldDate() {
    let date = new Date();
    let newDate = date.setDate(date.getDate() - 1);
    newDate = new Date(newDate)
    let year = newDate.getFullYear();
    let month = zero(newDate.getMonth() + 1);
    let day = zero(newDate.getDate());
    return year + "-" + month + "-" + day;
}

/**
 * 获取开始日期-结束日期之间的日期
 *
*/
export const getAllDate = (start, end) => {
    let dateArr = []
    let startArr = start.split('-')
    let endArr = end.split('-')
    let db = new Date()
    db.setUTCFullYear(startArr[0], startArr[1] - 1, startArr[2])
    let de = new Date()
    de.setUTCFullYear(endArr[0], endArr[1] - 1, endArr[2])
    let unixDb = db.getTime()
    let unixDe = de.getTime()
    let stamp
    const oneDay = 24 * 60 * 60 * 1000;
    for (stamp = unixDb; stamp <= unixDe;) {
      let date = formatDate(stamp)
      dateArr.push(date)
      stamp = stamp + oneDay
    }
    return dateArr
}

// 传入日期前一天，格式年月日
export const formatBeforeDate=(dates) =>{
    let date = new Date(dates);
    let newDate = date.setDate(date.getDate() - 1);
    newDate = new Date(newDate)
    let year = newDate.getFullYear();
    let month = zero(newDate.getMonth() + 1);
    let day = zero(newDate.getDate());
    console.log('前一天',year + "-" + month + "-" + day)
    return year + "-" + month + "-" + day;
}
// 传入日期后一天，格式年月日
export const formatAfterDate=(dates)=> {
    let date = new Date(dates);
 	let newDate = date.setDate(date.getDate() + 1);
 	newDate = new Date(newDate)
 	let year = newDate.getFullYear();
 	let month = zero(newDate.getMonth() + 1);
 	let day = zero(newDate.getDate());
    console.log('后一天',year + "-" + month + "-" + day)
 	return year + "-" + month + "-" + day;
}
// 传入日期当天天，格式年月日
export const formatDate=(dates)=> {
    let date = new Date(dates);
    let year = date.getFullYear();
    let month = zero(date.getMonth() + 1);
    let day = zero(date.getDate());
    return year + "-" + month + "-" + day;
}

export default {
    formatTodayDate,
    formatTime,
    formatOldDate,
}