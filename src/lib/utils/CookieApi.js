export default class CookieApi {

  /**
   *
   * @param key
   * @param value
   * @param expires
   * @param path
   * @param domain
   */
  static setCookie(key, value, expires = 365, path = '/', domain = '') {
    let now = new Date;
    expires = expires || 365;

    now.setDate(now.getDate() + expires);
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    value = encodeURIComponent(value || '');

    let domainStr = !!domain ? ('domain=' + domain) + ';'  : '';
    document.cookie = `${key}=${value};expires=${now.toUTCString()};path=${path};${domainStr}`;
  }

  /**
   * 获取cookie 默认自动编码
   * @param key
   * @param isAutoParse 是否为json数据需要转化为对象
   * @returns {string}
   */
  static getCookie(key, isAutoParse = false) {
    let cookie = document.cookie, value = '';

    if (cookie.length > 0) {
      let index = cookie.indexOf(key + "="), last;

      if (index !== -1) {
        index = index + key.length + 1;
        last = document.cookie.indexOf(";", index);
        if (last === -1) {
          last = document.cookie.length;
        }

        value = decodeURIComponent(document.cookie.substring(index, last));
        if (isAutoParse) {
          value = JSON.parse(value);
        }
      }
    }
    return value;
  }

  /**
   * 删除cookie
   * @param key
   */
  static deleteCookie(key) {
    let now = new Date;
    now.setTime(now.getTime() - 1);
    document.cookie = `${key}=1;expires=${now.toUTCString()}`;
  }
}
