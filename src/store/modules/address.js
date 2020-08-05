import { isEmpty } from 'lodash';
import ajax from '@/utils/ajax';

export default {
  namespaced: true,

  state: {
    info: [],
  },

  getters: {},

  mutations: {
    setInfo(state, info) {
      state.info = info;
    },
  },

  actions: {
    async fetch(context, address) {
      context.commit('setInfo', []);

      const { data } = await ajax.get(`/bank/balances/${address}`);

      if (isEmpty(data)) {
        throw new Error();
      }

      data.result.sort(i => (i.denom === 'gard' ? -1 : 1));
      context.commit('setInfo', data.result);
    },
  },
};
