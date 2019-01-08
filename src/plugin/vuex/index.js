import Vue from "vue";
import Vuex from "vuex";
import user from './modules/user'
import base from "../../lib/base";
import {UtilsBase} from "../../lib/utils/UtilsBase";

Vue.use(Vuex);

const client = UtilsBase.getClient();

export default new Vuex.Store({
  state: {
    isLogin: false,

    /**
     * 定义viewPort
     * 为了兼容手机版本
     */
    client: client,

    isMini: false,

    isOpenLeftMenu: false,

    viewPort: {},

    menuList: [{
      path: "",
      title: "",
      icon: "",

      children: [{
        path: "",
        title: "",
        icon: ""
      }]
    }]
  },


  /**
   * 必须由commit触发
   *  increment (state, payload) {
        state.count += payload.amount
      }
   */
  mutations: {
    login(state, payload) {
      base.setToken(UtilsBase.createRandomStr());
      base.saveUserData(payload);
      state.isLogin = true;
    },

    logOut(state) {
      base.removeToken();
      base.removeUserData();
      state.isLogin = false;
    },

    /**
     * 设置viewport
     * @param state
     * @param payload {{width, height}}
     */
    setViewPort(state, payload) {
      let isMini = payload.width < 1024;
      let initLeft = 0;

      if (!isMini && state.isOpenLeftMenu) {
        initLeft = 260;
      }

      // 是否为mini
      state.isMini = isMini;

      // 设置viewport
      state.viewPort = isMini ? {
        top: 64,
        left: initLeft,
        right: 0,
        bottom: 0
      } : {
        top: 64,
        left: initLeft,
        right: 0,
        bottom: 0
      }
    },

    toggleLeftMenu(state) {
      state.isOpenLeftMenu = !state.isOpenLeftMenu;
    },

    setLeftMenu(state, payload) {
      state.isOpenLeftMenu = payload;
    }
  },


  /**
   * 使用mapGetters
   *   ...mapGetters([
         'doneTodosCount',
         'anotherGetter',
         // ...
         ])
       }
   */
  getters: {
    isLogin(state) {
      return state.isLogin
    },

    viewPort(state) {
      return state.viewPort;
    },

    isMini(state) {
      return state.isMini;
    },

    menuList(state) {
      return state.menuList;
    },

    isOpenLeftMenu(state) {
      return state.isOpenLeftMenu;
    }
  },


  /**
   * dispatch触发
   * // dispatch with a payload
           store.dispatch('incrementAsync', {
          amount: 10
        })
   */
  actions: {
    login({commit, dispatch}, payload) {
      commit('login', payload);
    },

    logout({commit}) {
      commit('logout');
    },

    setViewPort({commit, dispatch}, payload){
      commit("setViewPort", payload);
    },

    toggleLeftMenu({commit}) {
      commit("toggleLeftMenu");
    },

    setLeftMenu({commit}, payload) {
      commit("setLeftMenu", payload);
    }
  },

  modules: {
    user
  }
});
