import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);

//config
let createRoutesConfig = [];

createRoutesConfig.push({
    path: "/",
    component: resolve => require(["@/page/home"], resolve),
    name: "home"
});

const router = new VueRouter({
  mode: "history", //history
  routes: createRoutesConfig
});

export const TemplateEnRoutesConfig = {};

export class TemplateRouterService {

  static push(name, query = null){
    router.push({ name, query});
  }

  static replace(name, query = null) {
    router.replace({ name, query});
  }
}

export default router;
