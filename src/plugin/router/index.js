import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);

//config
let createRoutesConfig = [
{path: "/page/channel/add", component: resolve => require(["@/page/channel/add"], resolve), name: "page.channel.add"},
{path: "/page/channel/manager", component: resolve => require(["@/page/channel/manager"], resolve), name: "page.channel.manager"},
{path: "/page/home", component: resolve => require(["@/page/home"], resolve), name: "page.home"},
{path: "/page/test/all", component: resolve => require(["@/page/test/all"], resolve), name: "page.test.all"},
{path: "/page/test/table", component: resolve => require(["@/page/test/table"], resolve), name: "page.test.table"},
{path: "/page/user/login", component: resolve => require(["@/page/user/login"], resolve), name: "page.user.login"}
];

createRoutesConfig.push({
    path: "/",
    component: resolve => require(["@/page/home"], resolve),
    name: "home"
});

const router = new VueRouter({
  mode: "history", //history
  routes: createRoutesConfig
});

export const EnRoutesConfig = {"pageChannelAdd":"page.channel.add","pageChannelManager":"page.channel.manager","pageHome":"page.home","pageTestAll":"page.test.all","pageTestTable":"page.test.table","pageUserLogin":"page.user.login"};

export class RouterService {

  static push(name, query = null){
    router.push({ name, query});
  }

  static replace(name, query = null) {
    router.replace({ name, query});
  }
}

export default router;
