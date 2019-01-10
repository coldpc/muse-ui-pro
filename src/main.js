import Vue from 'vue';
import App from './App';
import store from './plugin/vuex';
import router from './plugin/router';

// message插件
import MuseUIMessage from 'muse-ui-message';
Vue.use(MuseUIMessage);

// loading插件
import 'muse-ui-loading/dist/muse-ui-loading.css'; // load css
import MuseUILoading from 'muse-ui-loading';
Vue.use(MuseUILoading);

Vue.config.productionTip = false;

/*******************引入muse-ui样式*************/
import './plugin/museUi';
import './assets/main.css';
import './assets/iconfont/material-icons.css';

/************引入系统插件***************/
import './plugin/skirt';


import HttpClient from "./lib/http/HttpClient";
import RouterAccess from "./RouterAccess";
import systemBase from "./lib/systemBase";
import {UtilsBase} from "./lib/utils/UtilsBase";

// 小于尺寸变为小屏幕布局
const CO_MINI_SIZE = 1024;
const CO_TOP_BAR_HEIGHT = 64;
const CO_LEFT_MENU_WIDTH = 240;

class Main {
  static instance = null;
  static getInstance() {
    Main.instance = new Main(router, store);
  }

  app = null;
  routeAccess = null;
  router = null;
  store = null;

  constructor(router, store) {
    this.router = router;
    this.routeAccess = new RouterAccess(this.router, store);
    this.store = store;

    Main.initServiceFormat({
      errorMessageField: "errorMessage",
      codeField: "errorCode",
      normalCode: 1,
      dataField: "data"});

    this.initViewPort();

    this.render();
  }

  /**
   * 设置服务端数据格式
   * @param dataField
   * @param errorMessageField
   * @param codeField
   * @param normalCode
   */
  static initServiceFormat({dataField, errorMessageField, codeField, normalCode}) {
    HttpClient.setResponseDataFormat({
      errorMessageField,
      codeField,
      normalCode,
      dataField
    });
  }

  initViewPort() {
    window.addEventListener('resize', () => {
      this.setViewPort();
    });
    this.setViewPort();
  }

  /**
   * 设置视图布局
   */
  setViewPort() {
    const client = UtilsBase.getClient();

    let viewPort = {left: 0, top: CO_TOP_BAR_HEIGHT, right: 0, bottom: 0, leftMenuWidth: CO_LEFT_MENU_WIDTH, topBarHeight: CO_TOP_BAR_HEIGHT};
    let isMini = client.width < CO_MINI_SIZE, isOpen;

    if (!isMini) {
      isOpen = true;
      viewPort.left = viewPort.leftMenuWidth;
    }else {
      isOpen = false;
    }

    this.store.dispatch("setMini", isMini);
    this.store.dispatch("setLeftMenu", isOpen);
    this.store.dispatch("setViewPort", viewPort);
  }

  render() {
    this.app = new Vue({
        el: '#app',
        router,
        store,
        systemBase,
        render: h => h(App)
      });
  }
}

Main.getInstance();
