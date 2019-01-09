import * as types from './mutationsTypes'
import systemBase from '../../../../lib/systemBase';

const mutations = {
    [types.ALTER] (state, data) {
      state.data = data;
      systemBase.saveUserData(data);
    }
};

export default mutations;
