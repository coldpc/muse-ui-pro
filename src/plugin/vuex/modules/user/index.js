import actions from './actions'
import mutations from './mutations';


export default {
  namespaced: true,

  state: {
    data: {}
  },

  getters: {
    info(state) {
      return state.data;
    }
  },

  actions,
  mutations
}
