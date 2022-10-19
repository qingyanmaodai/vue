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
	} else {
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

function formatTommorowFiveDate() {
	let date = new Date();
	let newDate = date.setDate(date.getDate() + 3);
	newDate = new Date(newDate)
	let year = newDate.getFullYear();
	let month = zero(newDate.getMonth() + 1);
	let day = zero(newDate.getDate());
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

function formatOldTwoDate() {
	let date = new Date();
	let newDate = date.setDate(date.getDate() - 2);
	newDate = new Date(newDate)
	let year = newDate.getFullYear();
	let month = zero(newDate.getMonth() + 1);
	let day = zero(newDate.getDate());
	return year + "-" + month + "-" + day;
}
function formatTommorowDate() {
	let date = new Date();
	let newDate = date.setDate(date.getDate() + 1);
	newDate = new Date(newDate)
	let year = newDate.getFullYear();
	let month = zero(newDate.getMonth() + 1);
	let day = zero(newDate.getDate());
	return year + "-" + month + "-" + day;
}

function formatThirdDate() {
	let date = new Date();
	let newDate = date.setDate(date.getDate() - 3);
	newDate = new Date(newDate)
	let year = newDate.getFullYear();
	let month = zero(newDate.getMonth() + 1);
	let day = zero(newDate.getDate());
	return year + "-" + month + "-" + day;
}

function formatFivthDate() {
	let date = new Date();
	let newDate = date.setDate(date.getDate() - 15);
	newDate = new Date(newDate)
	let year = newDate.getFullYear();
	let month = zero(newDate.getMonth() + 1);
	let day = zero(newDate.getDate());
	return year + "-" + month + "-" + day;
}

function formatSevenDate() {
	let date = new Date();
	let newDate = date.setDate(date.getDate() - 6);
	newDate = new Date(newDate)
	let year = newDate.getFullYear();
	let month = zero(newDate.getMonth() + 1);
	let day = zero(newDate.getDate());
	return year + "-" + month + "-" + day;
}
function formatAddSevenDate() {
	let date = new Date();
	let newDate = date.setDate(date.getDate() + 6);
	newDate = new Date(newDate)
	let year = newDate.getFullYear();
	let month = zero(newDate.getMonth() + 1);
	let day = zero(newDate.getDate());
	return year + "-" + month + "-" + day;
}


function formatMonthDate() {
	let date = new Date();
	let newDate = date.setMonth(date.getMonth() + 1);
	newDate = new Date(newDate)
	let year = newDate.getFullYear();
	let month = zero(newDate.getMonth() + 1);
	let day = zero(newDate.getDate());
	return year + "-" + month + "-" + day;
}
function formatLastMonthDate() {
	let date = new Date();
	let newDate = date.setMonth(date.getMonth() - 1);
	newDate = new Date(newDate)
	let year = newDate.getFullYear();
	let month = zero(newDate.getMonth() + 1);
	let day = zero(newDate.getDate());
	return year + "-" + month + "-" + day;
}
// 获取当前时间,// 年月日 星期几 时分秒
function getTodayTime() {
	var date = new Date();
	var seperator1 = "年";
	var seperator2 = "月";
	var seperator3 = "日";
	var seperator4 = ":";
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var seconds = date.getSeconds();
	if (month >= 1 && month <= 9) {
		month = "0" + month;

	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;

	}
	if (hour >= 0 && hour <= 9) {
		hour = "0" + hour;

	}
	if (minute >= 0 && minute <= 9) {
		minute = "0" + minute;

	}
	if (seconds >= 0 && seconds <= 9) {
		seconds = "0" + seconds;

	}
	var a = new Array("日", "一", "二", "三", "四", "五", "六");
	var week = new Date().getDay();
	var str = "星期" + a[week];
	// 年月日 星期几 时分秒
	let todayDate = year + seperator1 + month + seperator2 + strDate + seperator3 + '  ' + str + ' ' + hour + seperator4 + minute + seperator4 + seconds;
	return todayDate
}
/**
     * 获取本、上、下周开始结束时间
     * @description 得到本、上、下周的起始、结束日期
     * @param {Number} n 不传或0代表本周，-1代表上周，1代表下周
     * @param {Number} type  0 开始时间  1 结束时间
     * @author Mt.flower
	 * 
	 * // 调用方式,例如
	this.getWeek(-1, 0) // 获取上周开始日期
	this.getWeek(-1, 1) // 获取上周结束日期
	this.getWeek(0, 0) // 获取本周开始日期
	this.getWeek(0, 1) // 获取本周结束日期
	this.getWeek(1, 0) // 获取下周开始日期
	this.getWeek(1, 1) // 获取下周结束日期
     */
 function getWeek(n, type) { // 周
	let now = new Date()
	let day = now.getDay() //返回星期几的某一天;
	if (!type) {
	  if (n == 1) {
		let dayNumber = day == 0 ? 0 : 7 - day
		now.setDate(now.getDate() + dayNumber + 1)
	  } else if (n == -1) {
		let dayNumber = day == 0 ? 6: day - 1
		now.setDate(now.getDate() - dayNumber - 7)
	  } else {
		let dayNumber = day == 0 ? 6: day - 1
		now.setDate(now.getDate() - dayNumber)
	  }
	} else {
	  if (n == 1) {
		let dayNumber = day == 0 ? 0 : 7 - day
		now.setDate(now.getDate() + dayNumber + 1 + 6) // 在周开始的日期上+6天=周结束
	  } else if (n == -1) {
		let dayNumber = day == 0 ? 6: day - 1
		now.setDate(now.getDate() - dayNumber - 7 + 6)
	  } else {
		let dayNumber = day == 0 ? 0: 7 - day
		now.setDate(now.getDate() + dayNumber)
	  }
	}
	let date = now.getDate()
	let month = now.getMonth() + 1

	let s = now.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date)
	return s
  }

  // 传入日期当天天，格式年月日
  function formatDates(dates) {
    let date = new Date(dates);
    let year = date.getFullYear();
    let month = zero(date.getMonth() + 1);
    let day = zero(date.getDate());
    return year + "-" + month + "-" + day;
}

export default {
	formatTodayDate,
	formatOldDate,
	formatTommorowDate,
	formatOldTwoDate,
	formatThirdDate,
	formatFivthDate,
	formatSevenDate,
	formatMonthDate,
	formatTime,
	formatLastMonthDate,
	formatTommorowFiveDate,
	getTodayTime,
	formatAddSevenDate,
	getWeek,
	formatDates
}
