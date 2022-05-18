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

export default {
    formatTodayDate,
    formatTime,
    formatOldDate
}