import axios from 'axios';
import './interceptors';
import {UtilsBase} from "../utils/UtilsBase";
import base from "../base";


/******请求类型**********/
export const EnContentType = {
  form: "application/x-www-form-urlencoded;charset=UTF-8",
  json: "application/json",
  file: "multipart/form-data",
  key: "Content-Type"
};

/*********请求方式***********/
export const EnHttpMethod = {
  post: 'post',
  get: 'get'
};

/***********请求的默认值*************/
export const EnHttpDefaults = {
  contentType: EnContentType.form,
  timeout: 20 * 60 * 1000, //响应时间
  method: EnHttpMethod.post, //请求方式
  baseURL: `${location.protocol}//${location.host}/h5-api` //响应时间
};

/************服务端返回的数据格式****************/
const ResponseDataFormat = {
  errorMessageField: "",
  codeField: "",
  normalCode: "",
  dataField: ""
};

class HttpClient {
  static setDefaults() {
    axios.defaults.timeout = EnHttpDefaults.timeout;//响应时间
    axios.defaults.method = EnHttpDefaults.method;//请求方式
    axios.defaults.baseURL = EnHttpDefaults.baseURL;//基础的url
  }

  static setResponseDataFormat({errorMessageField = 'message', codeField = 'code', normalCode =  0, dataField = 'data'}) {
    ResponseDataFormat.codeField = codeField;
    ResponseDataFormat.errorMessageField = errorMessageField;
    ResponseDataFormat.normalCode = normalCode;
    ResponseDataFormat.dataField = dataField;
  }

  /**
   * 请求ajax
   * @param url
   * @param method
   * @param data
   * @param mask
   * @param params
   * @param isCatchError
   * @param catchErrorCode
   * @param contentType
   * @param timeout
   * @param isParseData 是否格式化数据
   * @param headers
   * @returns {Promise<void>}
   */
  static request({
                 url,
                 method = EnHttpDefaults.method,
                 data = {},
                 mask = null,
                 params = {},
                 isCatchError = false,
                 catchErrorCode,
                 contentType = EnHttpDefaults.contentType,
                 timeout = EnHttpDefaults.timeout,
                 isParseData = true,
                 headers = {}
               }) {

    return new Promise(function (resolve, reject) {

      //get方式无法从data post数据
      if (method === EnHttpMethod.get && data) {
        for (let key in data) {
          params[key] = data[key];
          data = {};
        }
      }

      // 控制请求头部
      headers[EnContentType.key] = contentType;

      // 控制masker
      let loading = null;
      if (mask) {
        loading = base.loading(mask);
      }

      // 执行请求
      axios.request({
        url,
        method,
        data,
        params,
        timeout,
        headers
      }).then(({config, request, message, data}) => {

        if (loading) {
          loading.close();
        }

        // 有可能出现异常
        let error;

        // 格式化的数据 需要判断业务错误
        if (isParseData) {
          error = HttpClient.getDataError(data);
          if (!error) {
            data = HttpClient.getResponseData(data, isParseData);
          }
        }

        if (error) {
          HttpClient.ctrlError({error, isCatchError, catchErrorCode});
          reject(error);
        }else {
          resolve(data);
        }

      }).catch(({config, request, response, message}) => {

        if (loading) {
          loading.close();
        }

        // 异常处理
        let error;
        if (!response) {
          error = HttpClient.getNoResponseError(message);
        }else {
          error = HttpClient.getResponseError(response);
        }

        HttpClient.ctrlError({error, isCatchError, catchErrorCode});
        reject(error);
      });

    });
  }

  /**
   * 请求无响应的错误处理
   * @param message
   * @returns {{message: string, code: string}|{code: string, message: string}|{message: string, code: string}}
   */
  static getNoResponseError(message) {
    let error;
    message = message || "";

    if (!window.navigator.onLine) {
      error = {
        code: "NO_NETWORK",
        message: "未连接到网络"
      }
    }else if (message.indexOf("timeout") > -1){
      error = {
        message: "请求超时啦",
        code: "TIMEOUT"
      }
    }else {
      error = {
        message: "请求的服务器不在地球上",
        code: "NO_SERVICE"
      }
    }
    return error;
  }

  /**
   * 处理服务端返回的异常
   * @param response
   * @param error
   *
   */
  static getResponseError(response) {
    let error, {data, headers, resquest, status} = response;
    status = status + '';

    switch (status) {
      case '404':
        error = {
          message: "请求的路径不正确",
          code: '404'
        };
        break;

      case '400':
        error = {
          message: "服务端出现未知错误",
          code: '404'
        };
        break;

      default:
        error = {
          message: "服务端出现未知错误",
          code: status
        };
    }

    return error;
  }

  /**
   * 获取服务端数据
   * @param res
   * @returns {*}
   */
  static getResponseData(res) {
    return res[ResponseDataFormat.dataField];
  }

  /**
   * 根据格式化数据的配置，判定是否存在业务异常
   * @param res
   */
  static getDataError(res) {
    let code = res[ResponseDataFormat.codeField];
    if (!UtilsBase.checkIsEqual(code, ResponseDataFormat.normalCode)) {
      return {
        code,
        message: res[ResponseDataFormat.errorMessageField]
      };
    }
  }

  /**
   * 处理异常 系统处理异常会直接输出消息
   * @param error
   * @param isCatchError
   * @param catchErrorCode
   */
  static ctrlError({error, isCatchError, catchErrorCode}) {
    // 一种是用户不抓不异常， 或者不是用户感兴趣的异常
    if (!isCatchError || (!!catchErrorCode && !UtilsBase.checkIsEqual(error.code, catchErrorCode))) {
      base.alert(error.message);
    }
  }
}


// 设置号默认
HttpClient.setDefaults();
HttpClient.setResponseDataFormat({});

export default HttpClient;
