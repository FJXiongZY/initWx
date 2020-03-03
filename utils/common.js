/**
 * 处理日期（多少天前）
 * @param: {String}  timestamp 时间戳
 * @return {String}
*/
export const formatDate = function (timestamp) {
    let currentUnixTime = Math.round((new Date()).getTime() / 1000);
    let deltaSecond = currentUnixTime - parseInt(timestamp, 10);
    let result;
    if (deltaSecond < 60) {
        result = deltaSecond + '秒前';
    } else if (deltaSecond < 3600) {
        result = Math.floor(deltaSecond / 60) + '分钟前';
    } else if (deltaSecond < 86400) {
        result = Math.floor(deltaSecond / 3600) + '小时前';
    } else {
        result = Math.floor(deltaSecond / 86400) + '天前';
    }
    return result;
}

/**
 * 处理时间
 * @param: {String}  datetime 时间戳 || 字符串
 * @return {String} fmt     替换规则
 * @return {String} chars     如果有值，那么久说明不是时间戳，而是字符串
*/
export const formatTime = (datetime, fmt, chars) => {
    let reg = new RegExp(`/${chars}/`, g);
    if (chars) {
        datetime = new Date(Date.parse(d.replace(reg, "/"))); // 如果不是时间戳，那么就进行替换（兼容ios）
    }
    var o = {
        "Y+": datetime.getFullYear(), //年份 
        "M+": datetime.getMonth() + 1, //月份 
        "d+": datetime.getDate(), //日 
        "h+": datetime.getHours(), //小时 
        "m+": datetime.getMinutes(), //分 
        "s+": datetime.getSeconds(), //秒 
        "q+": Math.floor((datetime.getMonth() + 3) / 3), //季度 
        "S": datetime.getMilliseconds() //毫秒 
    };
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 * 计算
 * @return ： 天 时 分
 * @param {String} targetDate 传入的时间字符串
 */
export const getDistanceDescrib = (targetDate) => {
    let Today = new Date();
    let endDate = new Date(targetDate.replace(/\-/g, "/"));
    let leftSecond = parseInt((Today.getTime() - endDate.getTime()) / 1000);
    let Day = Math.floor(leftSecond / (60 * 60 * 24));
    let Hour = Math.floor((leftSecond - Day * 24 * 60 * 60) / 3600);
    let Minute = Math.floor((leftSecond - Day * 24 * 60 * 60 - Hour * 3600) / 60);
    if (Day > 0) {
        // if (Day <= 1) return `${Hour}小时前来过`;
        if (Day < 7) return `${Day}天前来过`;
        if (Day < 15) return `一周前来过`;
        if (Day < 30) return `半月前来过`;
        if (Day < 180) return `${parseInt(Day / 30)}个月前来过`;
        return `半年前来过`;
    }
    if (Hour > 0) return `${Hour}小时前来过`;
    if (Minute < 10) return `刚刚来过`;
    return `${Minute}分钟前来过`;
}