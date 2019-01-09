import Vue from "vue";
import Vuex from "vuex";
import user from './modules/user'
import systemBase from "../../lib/systemBase";
import {UtilsBase} from "../../lib/utils/UtilsBase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentRouteName: 'home',

    isLogin: systemBase.checkIsLogin(),

    isMini: false,

    isOpenLeftMenu: true,

    viewPort: {}
  },


  /**
   * 必须由commit触发
   *  increment (state, payload) {
        state.count += payload.amount
      }
   */
  mutations: {
    login(state, payload) {
      systemBase.setToken(UtilsBase.createRandomStr());
      systemBase.saveUserData(payload);
      state.isLogin = true;
    },

    logout(state) {
      systemBase.removeToken();
      systemBase.removeUserData();
      state.isLogin = false;
    },

    /**
     * 设置viewport
     * @param state
     * @param payload {{top, left, right, bottom, leftMenuWidth, topBarHeight}}
     */
    setViewPort(state, payload) {
      let viewPort = state.viewPort;
      let {top = viewPort.top,
        left = viewPort.left,
        right = viewPort.right,
        bottom = viewPort.bottom,
        leftMenuWidth = viewPort.leftMenuWidth,
        topBarHeight = viewPort.topBarHeight
      } = payload;

      state.viewPort = {
        top,
        left,
        right,
        bottom,
        leftMenuWidth,
        topBarHeight
      }
    },

    toggleLeftMenu(state) {
      state.isOpenLeftMenu = !state.isOpenLeftMenu;
    },

    setLeftMenu(state, payload) {
      state.isOpenLeftMenu = payload;
    },

    setMini(state, payload) {
      state.isMini = payload;
    },

    switchRoute(state, routeName) {
      state.currentRouteName = routeName;
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

    isOpenLeftMenu(state) {
      return state.isOpenLeftMenu;
    },

    currentRouteName(state) {
      return state.currentRouteName;
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

    setMini({commit}, payload) {
      commit("setMini", payload);
    },

    toggleLeftMenu({commit}) {
      commit("toggleLeftMenu");
    },

    setLeftMenu({commit}, payload) {
      commit("setLeftMenu", payload);
    },

    setViewPort({commit}, payload) {
      commit("setViewPort", payload);
    },

    switchRoute({commit}, payload) {
      commit("switchRoute", payload);
    }
  },

  modules: {
    user
  }
});
