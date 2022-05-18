var taskSizeChart = echarts.init(document.getElementById('taskSize'));
var startTime = new Date();

var todaySyncedNum = 0;
var todayNoSyncNum = 0;
var delayNum = 0;

$(function () {
    $('input').bind('input propertychange', function () {
        $('.commonTable tbody tr').hide()
            .filter(":contains('" + ($(this).val()) + "')").show();
    });

    $("#refreshBtn").click(function () {
        initTable();
    });
    initTable();
    setInterval(initTable, 1000 * 10);
    setInterval(tick, 1000);
});

function tick(){
    var today = new Date();
    document.getElementById("localtime").innerHTML = showLocale(today);

    var t = today - startTime;
    var day = Math.floor(t/1000/60/60/24);
    var hour = Math.floor(t/1000/60/60%24);
    var min = Math.floor(t/1000/60%60);
    var sec = Math.floor(t/1000%60);
    $("#runTimeTj").html(day+" 澶� "+hour+" 灏忔椂 "+min+" 鍒� "+sec+" 绉�");
}

function syncTj() {
    $("#addTj").html(Math.ceil(Math.random() * 10) + " ms");
    $("#updateTj").html(Math.ceil(Math.random() * 10) + " ms");
    $("#deleteTj").html(Math.ceil(Math.random() * 10) + " ms");

    var today = new Date();

    var option = taskSizeChart._option;
    var data0 = option.series[0].data;//鏈

    data0.shift();//鍒犻櫎绗竴涓�
    data0.push(Math.ceil(Math.random() * 10000) * 2 + 503);//杩藉姞涓€涓柊鏁版嵁

    option.xAxis[0].data.shift();
    option.xAxis[0].data.push( today.getMinutes() + ":" + today.getSeconds());//鏇存柊x杞�

    taskSizeChart.setOption(option);
}

function taskSizeTj(){
    var names = [];
    var values = [];
    var option = {
        color: ['#00b3ac'],
        legend: {
            data: ['鍚屾閲忕粺璁�'],
            x: 'center',
            y: 30
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {
                type : 'shadow'
            }
        },
        xAxis : [
            {
                data : names,
                type: 'category',
                splitLine:{
                    show: false
                },
                axisLabel: {
                    interval: 0,
                    show: true,
                    textStyle: {
                        color: '#c3dbff',  //鏇存敼鍧愭爣杞存枃瀛楅鑹�
                        fontSize : 14      //鏇存敼鍧愭爣杞存枃瀛楀ぇ灏�
                    }
                }
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#c3dbff'
                    }
                }
            }
        ],
        series : [
            {
                name:'鏁版嵁閲忥紙鏉★級',
                type:'line',
                smooth: true,
                barWidth: '60%',
                data:values
            }
        ]
    };
    var _time = new Date().getTime();
    for(var i = 12; i > 0; i--){
        var _tempDate = new Date(_time - 1000 * 10 * i);
        names.push(_tempDate.getMinutes() + ":" + _tempDate.getSeconds());
        values.push(Math.ceil(Math.random() * 10000) * 2 + 503);
    }
    option.xAxis[0].data.value = names;
    option.series[0].data.value = values;
    taskSizeChart.setOption(option);
}

function timestampToTime(fmt, timestamp) {
    var date = new Date(timestamp);
    var ret;
    var opt = {
        "Y+": date.getFullYear().toString(),        // 骞�
        "m+": (date.getMonth() + 1).toString(),     // 鏈�
        "d+": date.getDate().toString(),            // 鏃�
        "H+": date.getHours().toString(),           // 鏃�
        "M+": date.getMinutes().toString(),         // 鍒�
        "S+": date.getSeconds().toString()          // 绉�
        // 鏈夊叾浠栨牸寮忓寲瀛楃闇€姹傚彲浠ョ户缁坊鍔狅紝蹇呴』杞寲鎴愬瓧绗︿覆
    };
    for (var k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

function mySort(data){
    var arr = [];
    for(i in data){
        if("flag" != i && "exceptions" != i && "delay" != i){
            var temp = data[i];
            temp["name"] = i;
            arr.push(temp);
        }
    }
    arr.sort(function(a,b){return b['todayOffset'] > a['todayOffset'] ? 1 : -1 })
    return arr;
}

function initTable() {
    taskSizeTj();
    syncTj();
    var HTML = "<thead>\n" +
        "        <td title=\"搴忓彿\">搴忓彿</td>\n" +
        "        <td title=\"鍩庡競\">鍩庡競</td>\n" +
        "        <td title=\"鎬荤敓浜ч噺\">鎬荤敓浜ч噺</td>\n" +
        "        <td title=\"鎬绘秷璐归噺\">鎬绘秷璐归噺</td>\n" +
        "        <td title=\"浠婃棩娑堣垂\">浠婃棩娑堣垂</td>\n" +
        "        <td title=\"浠婃棩娑堣垂寮傚父\">浠婃棩娑堣垂寮傚父</td>\n" +
        "        <td title=\"寰呮秷璐筡">寰呮秷璐�</td>\n" +
        "        <td title=\"鏈€杩戜竴鏉℃暟鎹悓姝ユ椂闂碶">鏈€杩戞暟鎹悓姝ユ椂闂�</td>\n" +
        "        <td title=\"鐘舵€乗">鐘舵€�</td>\n" +
        "        <td title=\"鏈€鏂扮洃鎺у埛鏂版椂闂碶">鍒锋柊鏃堕棿</td>\n" +
        "        </thead>\n" +
        "        <tbody>\n";
    var data = getData();
    var myData = mySort(data);
    $(myData).each(function (index, ele) {
        HTML += "<tr>\n" +
            "            <td>" + (index + 1) + "</td>\n" +
            "            <td>" + ele['name'] + "</td>\n" +
            "            <td>" + ele['total'] + "</td>\n" +
            "            <td>" + ele['offset'] + "</td>\n" +
            "            <td><span style='color: #00cc00'>" + ele['todayOffset'] + "</span></td>\n" +
            "            <td>" + ele['todayConsumeError'] + "</td>\n" +
            "            <td>" + ele['overstock'] + "</td>\n" +
            "            <td>" + timestampToTime("YYYY-mm-dd HH:MM:SS", ele['syncDate']) + "</td>\n" +
            "            <td><span class=\"btn btn-small\" style=\"width: 80px\" >姝ｅ父</span></td>\n" +
            "            <td><span style='color: #00cc00;'>" + timestampToTime("YYYY-mm-dd HH:MM:SS", ele['date']) + "</span></td>\n";
    });
    HTML += "</tbody>";
    $('.commonTable').html(HTML);

    var todaySynced = Math.ceil(Math.random() * 10000) + 500 + todaySyncedNum;
    var todayNoSync = Math.ceil(Math.random() * 30) + 16;
    var delay = parseFloat(Math.ceil(Math.random() * 3)).toFixed(1);

    $("#todaySyncSpan").numberRockInt({
        initNumber: todaySyncedNum,
        lastNumber: todaySynced,
        duration: 5000,
        step: 8
    });

    $("#todayNoSyncSpan").numberRockInt({
        initNumber: todayNoSyncNum,
        lastNumber: todayNoSync,
        step: 5
    });

    $("#syncDelaySpan").numberRockFloat({
        initNumber: delayNum,
        lastNumber: delay,
        fixedSize: 1,
        easing: "linear"
    });

    todaySyncedNum = todaySynced;
    todayNoSyncNum = todayNoSync;
    delayNum = delay;

    $("#syncStateSpan").html("<font color='#00cc00'>姝ｅ父</font>");

    $('.commonTable tbody tr').hide()
        .filter(":contains('" + ($("#searchText").val()) + "')").show();

}

function showLocale(objD){
    var str,colorhead,colorfoot;
    var yy = objD.getYear();
    if(yy<1900) yy = yy+1900;
    var MM = objD.getMonth()+1;
    if(MM<10) MM = '0' + MM;
    var dd = objD.getDate();
    if(dd<10) dd = '0' + dd;
    var hh = objD.getHours();
    if(hh<10) hh = '0' + hh;
    var mm = objD.getMinutes();
    if(mm<10) mm = '0' + mm;
    var ss = objD.getSeconds();
    if(ss<10) ss = '0' + ss;
    var ww = objD.getDay();
    if  ( ww==0 )  colorhead="<font color=\"#ffffff\">";
    if  ( ww > 0 && ww < 6 )  colorhead="<font color=\"#ffffff\">";
    if  ( ww==6 )  colorhead="<font color=\"#ffffff\">";
    if  (ww==0)  ww="鏄熸湡鏃�";
    if  (ww==1)  ww="鏄熸湡涓€";
    if  (ww==2)  ww="鏄熸湡浜�";
    if  (ww==3)  ww="鏄熸湡涓�";
    if  (ww==4)  ww="鏄熸湡鍥�";
    if  (ww==5)  ww="鏄熸湡浜�";
    if  (ww==6)  ww="鏄熸湡鍏�";
    colorfoot="</font>"
    str = colorhead + yy + "-" + MM + "-" + dd + " " + hh + ":" + mm + ":" + ss + "  " + ww + colorfoot;
    return(str);
}

function hideBugBtn() {
    $("#bugBtn").hide();
}

function getData() {
    var _temp = Math.ceil(Math.random() * 290000);
    return {
        "flag": true,
        "鍖椾含": {
            "status": true,
            "total": Math.ceil(Math.random() * 9500000),
            "offset": Math.ceil(Math.random() * 940000),
            "overstock": Math.ceil(Math.random() * 10),
            "todayOffset": Math.ceil(Math.random() * 500),
            "todayConsumeError": 0,
            "syncDate": 1608175795148,
            "date": 1608186111190,
            "startDate": 1608175795148,
            "messge": null
        },
        "閮戝窞": {
            "status": true,
            "total": Math.ceil(Math.random() * 9500000),
            "offset": Math.ceil(Math.random() * 940000),
            "overstock": Math.ceil(Math.random() * 10),
            "todayOffset": Math.ceil(Math.random() * 500),
            "todayConsumeError": 0,
            "syncDate": 1608175807331,
            "date": 1608186123476,
            "startDate": 1608175807331,
            "messge": null
        },
        "姝︽眽": {
            "status": true,
            "total": Math.ceil(Math.random() * 9500000),
            "offset": Math.ceil(Math.random() * 940000),
            "overstock": Math.ceil(Math.random() * 10),
            "todayOffset": Math.ceil(Math.random() * 500),
            "todayConsumeError": 0,
            "syncDate": 1608175805062,
            "date": 1608186121035,
            "startDate": 1608175805062,
            "messge": null
        },
        "涔岄瞾鏈ㄩ綈": {
            "status": true,
            "total": Math.ceil(Math.random() * 9500000),
            "offset": Math.ceil(Math.random() * 940000),
            "overstock": 0,
            "todayOffset": Math.ceil(Math.random() * 500),
            "todayConsumeError": 0,
            "syncDate": 1608175805946,
            "date": 1608186121104,
            "startDate": 1608175805946,
            "messge": null
        },
        "鍝堝皵婊�": {
            "status": true,
            "total": Math.ceil(Math.random() * 9500000),
            "offset": Math.ceil(Math.random() * 940000),
            "overstock": Math.ceil(Math.random() * 10),
            "todayOffset": Math.ceil(Math.random() * 500),
            "todayConsumeError": 0,
            "syncDate": 1608175797293,
            "date": 1608186111590,
            "startDate": 1608175797293,
            "messge": null
        },
        "骞垮窞": {
            "status": true,
            "total": Math.ceil(Math.random() * 9500000),
            "offset": Math.ceil(Math.random() * 940000),
            "overstock": Math.ceil(Math.random() * 10),
            "todayOffset": Math.ceil(Math.random() * 500),
            "todayConsumeError": 0,
            "syncDate": 1608175796386,
            "date": 1608186112653,
            "startDate": 1608175796386,
            "messge": null
        },
        "娴庡崡": {
            "status": true,
            "total": Math.ceil(Math.random() * 9500000),
            "offset": Math.ceil(Math.random() * 940000),
            "overstock": Math.ceil(Math.random() * 10),
            "todayOffset": Math.ceil(Math.random() * 500),
            "todayConsumeError": 0,
            "syncDate": 1608175798776,
            "date": 1608186113376,
            "startDate": 1608175798776,
            "messge": null
        },
        "鍗楀畞": {
            "status": true,
            "total": Math.ceil(Math.random() * 9500000),
            "offset": Math.ceil(Math.random() * 940000),
            "overstock": Math.ceil(Math.random() * 10),
            "todayOffset": Math.ceil(Math.random() * 500),
            "todayConsumeError": 0,
            "syncDate": 1608175801541,
            "date": 1608186117416,
            "startDate": 1608175801541,
            "messge": null
        },
        "瑗垮畨": {
            "status": true,
            "total": Math.ceil(Math.random() * 9500000),
            "offset": Math.ceil(Math.random() * 940000),
            "overstock": Math.ceil(Math.random() * 10),
            "todayOffset": Math.ceil(Math.random() * 500),
            "todayConsumeError": 0,
            "syncDate": 1608175806458,
            "date": 1608186120973,
            "startDate": 1608175806458,
            "messge": null
        },
        "鍛煎拰娴╃壒": {
            "status": true,
            "total": Math.ceil(Math.random() * 9500000),
            "offset": Math.ceil(Math.random() * 940000),
            "overstock": Math.ceil(Math.random() * 10),
            "todayOffset": Math.ceil(Math.random() * 500),
            "todayConsumeError": 0,
            "syncDate": 1608175797815,
            "date": 1608186111654,
            "startDate": 1608175797815,
            "messge": null
        },
        "澶師": {
            "status": true,
            "total": Math.ceil(Math.random() * 9500000),
            "offset": Math.ceil(Math.random() * 940000),
            "overstock": Math.ceil(Math.random() * 10),
            "todayOffset": Math.ceil(Math.random() * 500),
            "todayConsumeError": 0,
            "syncDate": 1608175804551,
            "date": 1608186120987,
            "startDate": 1608175804551,
            "messge": null
        },
        "娌堥槼": {
            "status": true,
            "total": Math.ceil(Math.random() * 9500000),
            "offset": Math.ceil(Math.random() * 940000),
            "overstock": Math.ceil(Math.random() * 10),
            "todayOffset": Math.ceil(Math.random() * 500),
            "todayConsumeError": 0,
            "syncDate": 1608175803840,
            "date": 1608186119489,
            "startDate": 1608175803840,
            "messge": null
        },
        "鍗楁槍": {
            "status": true,
            "total": Math.ceil(Math.random() * 9500000),
            "offset": Math.ceil(Math.random() * 940000),
            "overstock": Math.ceil(Math.random() * 10),
            "todayOffset": Math.ceil(Math.random() * 500),
            "todayConsumeError": 0,
            "syncDate": 1608175800856,
            "date": 1608186118199,
            "startDate": 1608175800856,
            "messge": null
        },
        "涓婃捣": {
            "status": true,
            "total": Math.ceil(Math.random() * 9500000),
            "offset": Math.ceil(Math.random() * 940000),
            "overstock": Math.ceil(Math.random() * 10),
            "todayOffset": Math.ceil(Math.random() * 500),
            "todayConsumeError": 0,
            "syncDate": 1608175802935,
            "date": 1608186117231,
            "startDate": 1608175802935,
            "messge": null
        },
        "鎴愰兘": {
            "status": true,
            "total": Math.ceil(Math.random() * 9500000),
            "offset": Math.ceil(Math.random() * 940000),
            "overstock": Math.ceil(Math.random() * 10),
            "todayOffset": Math.ceil(Math.random() * 500),
            "todayConsumeError": 0,
            "syncDate": 1608175795859,
            "date": 1608186111374,
            "startDate": 1608175795859,
            "messge": null
        },
        "delay": 0
    };
}