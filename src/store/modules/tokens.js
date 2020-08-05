import { isEmpty } from 'lodash';
import $ajax from '@/utils/ajax';

export default {
  namespaced: true,
  state: {
    details: {},
    load: false,
  },
  mutations: {
    setDetails(state, data) {
      state.details = Object.assign({}, state.details, data);
    },
    setLoad(state, load) {
      state.load = load;
    },
  },
  actions: {
    async fetchDetail(context, id) {
      // check if existed;
      if (!isEmpty(context.state.details[id])) {
        return undefined;
      }

      context.commit('setLoad', true);

      const { data } = await $ajax.get(`/issue/query/${id}`);

      context.commit('setLoad', false);

      if (isEmpty(data)) {
        throw new Error();
      }

      context.commit('setDetails', {
        [id]: data.value,
      });

      return data;
    },
  },
};
