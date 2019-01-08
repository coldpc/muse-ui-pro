import {EnContentType} from "./HttpClient";
import Qs from 'qs';
import axios from 'axios';

/**************拦截config********************/
axios.interceptors.request.use(function (config) {
  if (config.headers[EnContentType.key] === EnContentType.form) {
    config.data = Qs.stringify(config.data);
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

/****************拦截响应********************/
// axios.interceptors.response.use(function (response) {
//   return response;
// }, function (error) {
//   debugger;
//   return error;
// });
