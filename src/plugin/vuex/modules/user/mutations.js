import * as types from './mutationsTypes'
import base from '../../../../lib/base';

const mutations = {
    [types.ALTER] (state, data) {
      state.data = data;
      base.saveUserData(data);
    }
};

export default mutations;
