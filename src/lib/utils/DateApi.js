import {UtilsBase} from "./UtilsBase";

export default class DateApi {

  /**
   * 获取过去几天的中文名称数组
   * @returns {*[]}
   */
  static getLastDaysChineseName() {
    function getDate(dDays) {
      let d = new Date();
      d.setDate(d.getDate() + dDays);

      return new Date(d);
    }

    return [
      {
        d: getDate(-1),
        name: "昨天"
      },
      {
        d: getDate(0),
        name: "今天"
      },
      {
        d: getDate(1),
        name: "明天"
      },
      {
        d: getDate(2),
        name: "后天"
      }
    ];
  }

  static getChinesDayName(date) {
    let lastDays = DateApi.getLastDaysChineseName();

    let d;
    for (let i = 0, l = lastDays.length; i < l; i++) {
      d = lastDays[i].d;
      if (d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth() && d.getDate() === date.getDate()) {
        return lastDays[i].name;
      }
    }
  }

  static chineseDayNames = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

  static toDate(date) {
    if(UtilsBase.checkIsNumber(date)){
      date = new Date(parseFloat(date));
    } if (typeof date === 'string'){
      date = new Date(date.replace(/\-/gi, "/"));
    }
    return date;
  }

  /**
   * 格式化日期
   * @param date
   * @param fmt
   * @param isChinese
   * @returns {*}
   */
  static format(date, fmt = "yyyy-MM-dd hh:mm:ss", isChinese = false) {
    if (!date) {
      return date;
    }

    // 如果是数字
    if(UtilsBase.checkIsNumber(date)){
      date = new Date(parseFloat(date));
    }else if (typeof date === 'string'){
      date = new Date(date);
    }

    let o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };

    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));

    for (let k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));

    // 如果显示中国习惯的日期 如：昨天 08:00
    if (isChinese) {
      let name = DateApi.getChinesDayName(date);
      if (name) {
        fmt = name + fmt.substr(10);
      }
    }
    return fmt;
  }

}
