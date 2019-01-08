export default class DomApi {

  /**
   * 可视区高度，不包含滚动卷曲的高度
   * @returns {{pageWidth: number, pageHeight: number}}
   */
  static getPageSize() {
    let t = window;
    return "CSS1Compat" === t.document.compatMode ? {
      width: t.document.documentElement.clientWidth,
      height: t.document.documentElement.clientHeight
    } : "number" === typeof t.innerWidth ? {
      width: t.innerWidth,
      height: t.innerHeight
    } : {
      width: t.document.body.clientWidth,
      height: t.document.body.clientHeight
    }
  }
}
