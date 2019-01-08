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

import HttpClient from "./lib/http/HttpClient";
import RouterAccess from "./RouterAccess";
import base from "./lib/base";
import {UtilsBase} from "./lib/utils/UtilsBase";

// 设置系统数据格式
HttpClient.setResponseDataFormat({
  errorMessageField: "errorMessage",
  codeField: "errorCode",
  normalCode: 1,
  dataField: "data"
});

// 路由权限控制
new RouterAccess(router);

// 设置试图
store.dispatch("setViewPort", UtilsBase.getClient());

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  base,
  render: h => h(App)
});
