import actions from './actions'
import mutations from './mutations';
import systemBase from "../../../../lib/systemBase";


export default {
  namespaced: true,

  state: {
    data: systemBase.getUserData() || {}
  },

  getters: {
    info(state) {
      return state.data;
    }
  },

  actions,
  mutations
}
