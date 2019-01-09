import Vue from 'vue';
import LocalStorageApi from "./utils/LocalStorageApi";
import CookieApi from "./utils/CookieApi";
import MuseUIMessage from 'muse-ui-message';
import MuseUILoading from 'muse-ui-loading';

// 用户数据存储
const USER_STORAGE_KEY = 'user_storage_key';

const USER_TOKEN_KEY = "user_token_key";

const pluginConfig = {
  width: "600px"
};

class Base {
  constructor() {

  }

  install(Vue){
    Vue.prototype.$systemBase = this;
  }

  use() {

  }

  saveUserData(data) {
    LocalStorageApi.setItem(USER_STORAGE_KEY, data);
  }

  getUserData() {
    return LocalStorageApi.getItem(USER_STORAGE_KEY, true);
  }

  removeUserData() {
    LocalStorageApi.removeItem(USER_STORAGE_KEY);
  }

  /**
   * 检验是否登录过
   * 未登录直接跳转登录
   *
   */
  checkIsLogin() {
    let token = CookieApi.getCookie(USER_TOKEN_KEY);
    return !!token;
  }

  setToken(token) {
    CookieApi.setCookie(USER_TOKEN_KEY, token);
  }

  removeToken() {
    CookieApi.deleteCookie(USER_TOKEN_KEY);
  }

  alert(message) {
    MuseUIMessage.alert(message, "提示", pluginConfig);
  }

  //  result:  true click ok Button, false click cancel button
  //  value: input value
  confirm(message, okFunc, cancelFunc) {
    MuseUIMessage.confirm(message, "提示", pluginConfig).then(({ result, value }) => {

      if (result) {
        if (typeof okFunc === 'function') {
          okFunc(value);
        }
      }else {
        if (typeof cancelFunc === 'function') {
          cancelFunc(value);
        }
      }
    });
  }

  /**
   * 显示加载中动画
   * @param text
   * @param target
   * @param color
   */
  loading({text = "加载中", target = window.document.body, color}) {
    const loading = MuseUILoading({
      text,
      target,
      color
    });
    return loading;
  }
}


const systemBase = new Base();
Vue.use(systemBase);

export default systemBase;
