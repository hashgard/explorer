import {
  isEmpty
} from 'lodash';
import $ajax from '@/utils/ajax';

export default {
  namespaced: true,
  state: {
    list: [],
    details: {},
    load: false,
    voteList: []
  },
  mutations: {
    setList(state, list) {
      state.list = list.result;
    },
    setDetails(state, data) {
      state.details = Object.assign({}, state.details, data);
    },
    setLoad(state, load) {
      state.load = load;
    },
    setVoteList(state, data) {
      state.voteList = data
    }
  },
  actions: {
    async fetchList(context) {
      context.commit('setLoad', true);

      const {
        data
      } = await $ajax.get('/gov/proposals');

      context.commit('setLoad', false);
      context.commit('setList', data);

      return data;
      // const type = encodeURIComponent(`CONTAINS'OrgApply'`)
      // context.commit('setLoad', true);
      // const {
      //   data
      // } = await $ajax.get(`/txs?submit_proposal.proposal_type=${type}`);
      // context.commit('setLoad', false);
      // context.commit('setList', data);
      // return Promise.resolve(data);
    },
    async fetchDetail(context, id) {
      // check if existed;
      if (!isEmpty(context.state.details[id])) {
        return undefined;
      }

      context.commit('setLoad', true);

      const {
        data
      } = await $ajax.get(`/gov/proposals/${id}`);

      context.commit('setLoad', false);

      if (isEmpty(data)) {
        throw new Error();
      }

      context.commit('setDetails', {
        [id]: data
      });

      return data;
    },
    async fetchVoteList(context, id) {
      const {
        data
      } = await $ajax.get(`/gov/proposals/${id}/votes`);


      if (isEmpty(data)) {
        throw new Error();
      }

      context.commit('setVoteList', data.result);
    }
  },
};