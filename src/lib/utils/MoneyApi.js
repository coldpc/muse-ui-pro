export default class MoneyApi {

  /**
   * 格式化金钱 0.00
   * @param value
   * @param nullText
   * @returns {string}
   */
  static format(value, nullText = '-') {
    let v = parseFloat(value);

    //不存在合法值得情况用nullText
    if (isNaN(v)) {
      return nullText;
    }

    //存在值
    let n = 2;
    v = parseFloat((v + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    let l = v.split(".")[0].split("").reverse(), r = v.split(".")[1],
      t = "";
    for (let i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
  }
}
