import {
  isEmpty,
  get,
} from 'lodash';
import ajax from '@/utils/ajax';

export default {
  namespaced: true,

  state: {
    netName: '',
    pool: {},
  },

  getters: {},

  mutations: {
    setNetName(state, name) {
      state.netName = name;
    },
    setPool(state, pool) {
      state.pool = pool;
    },
  },

  actions: {
    async fetchNetInfo(ctx) {
      const { data } = await ajax.get('node_info');

      if (isEmpty(data)) {
        throw new Error();
      }

      ctx.commit('setNetName', get(data, 'node_info.network'));
    },
    async fetchPool(context) {
      const { data } = await ajax.get('/staking/pool');

      if (isEmpty(data)) {
        throw new Error();
      }

      context.commit('setPool', data.result);
    },
  },
};
