import Vue from "vue";
import Vuex from "vuex";
import user from './modules/user'
import base from "../../lib/base";
import {UtilsBase} from "../../lib/utils/UtilsBase";

Vue.use(Vuex);


export default new Vuex.Store({
  state: {
    isLogin: false
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

    logout({commit, dispatch}) {
      commit('logout');
    }
  },

  modules: {
    user
  }
});
