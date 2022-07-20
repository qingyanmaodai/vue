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

function zero(num) {
    if (Number(num) < 10) {
        return '0' + num
    }
    else {
        return num
    }
}

function formatTodayDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = zero(date.getMonth() + 1);
    let day = zero(date.getDate());
    return year + "-" + month + "-" + day;
}
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
      dateArr.push(moment(new Date(parseInt(stamp))).format('YYYY-MM-DD'))
      stamp = stamp + oneDay
    }
    return dateArr
  }

export default {
    formatTodayDate,
    formatTime,
    formatOldDate
}