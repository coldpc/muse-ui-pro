export default class LocalStorageApi {

  /**
   * 移除本地缓存项
   * @param key
   * @returns {boolean}
   */
  static removeItem(key) {
    let localStorage = window.localStorage;
    if (localStorage) {
      localStorage.removeItem(key);
      return true;
    } else {
      return false;
    }
  }

  /**
   * 加入缓存项
   * @param key
   * @param value
   * @returns {boolean}
   */
  static setItem(key, value) {
    let localStorage = window.localStorage;

    if (localStorage) {
      if (typeof value !== "object") {
        localStorage.setItem(key, value);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    }
  }

  /**
   * 获取存储项
   * @param key
   * @param isParse
   * @returns {string}
   */
  static getItem(key, isParse) {
    let data = window.localStorage.getItem(key);
    if (data && isParse) {
      data = JSON.parse(data);
    }
    return data;
  }
}
