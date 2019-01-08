export class RouteApi {

  /**
   * 添加参数至url
   * @param url
   * @param params {k1: }
   */
  static addParams(url, params) {
    for (let key in params) {
      RouteApi.addParam(url, key, params[key]);
    }
  }

  static addParam(url, key, value) {
    if (url.indexOf("?") === -1) {
      url += "?";
    } else {
      url += "&";
    }
    url += key + "=" + encodeURIComponent(value);
    return url;
  }
}

