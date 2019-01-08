import * as types from './mutationsTypes'

const alter = ({ commit }, data) => {
    commit(types.ALTER, data);
};

export default {
    alter
};