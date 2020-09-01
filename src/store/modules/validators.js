import {
  set,
  isEmpty,
} from 'lodash';
import $ajax from '@/utils/ajax';

export default {
  namespaced: true,

  state: {
    list: [],
    consPubMap: {},
    latest: null,
    details: {},
    delegationsTotal: 0,
    redelegationsTotal: 0,
    redelegationsToTotal: 0,
    unbondingDelegationsTotal: 0,
    rewards: {}
  },

  getters: {
    onlineList: state => state.list.filter(i => !i.jailed),
  },

  mutations: {
    setList(state, data) {
      set(state, 'list', data);
    },
    setDetail(state, data) {
      state.details = Object.assign({}, state.details, data);
    },
    setConsPubMap(state, data) {
      state.consPubMap = Object.assign({}, state.consPubMap, data);
    },
    setDelegationsTotal(state, data) {
      state.delegationsTotal = data
    },
    setUnbondingDelegationsTotal(state, data) {
      state.unbondingDelegationsTotal = data
    },
    setRedelegationsTotal(state, data) {
      state.redelegationsTotal = data
    },
    setRedelegationsToTotal(state, data) {
      state.redelegationsToTotal = data
    },
    setRewards(state, data) {
      state.rewards = data
    }
  },

  actions: {
    async fetchAll(context, status) {
      const {
        data
      } = await $ajax.get(`/staking/validators?status=${status}`);

      if (data) {
        data.result.sort((a, b) => b.tokens - a.tokens);

        context.commit(
          'setList',
          data.result.map((i, index) => {
            i.number = index + 1;

            return i;
          }),
        );

        data.result.forEach((i) => {
          context.commit('setConsPubMap', {
            [i.consensus_pubkey]: i,
          });
        });
      }
    },
    async fetchDetail(context, address) {
      if (!isEmpty(context.state.details[address])) {
        return;
      }

      const {
        data
      } = await $ajax.get(`/staking/validators/${address}`);

      if (isEmpty(data)) {
        throw new Error();
      }

      context.commit('setDetail', {
        [address]: data,
      });
    },
    async fetchDistribution(context, address) {
      const {
        data
      } = await $ajax.get(`/distribution/validators/${address}`)
      if (isEmpty(data)) {
        throw new Error();
      }
      return Promise.resolve(data.result)
    },
    async fetchOutstandingRewards(context, address) {
      const {
        data
      } = await $ajax.get(`/distribution/validators/${address}/outstanding_rewards`)
      if (isEmpty(data)) {
        throw new Error();
      }
      return Promise.resolve(data.result)
    },
    async fetchDelegations(context, params) {
      const {
        data
      } = await $ajax.get(`/staking/validators/${params.address}/delegations`)
      if (isEmpty(data)) {
        throw new Error();
      }
      data.result.sort((a, b) => {
        return b.balance - a.balance
      })
      context.commit("setDelegationsTotal", data.result ? data.result.length : 0)
      return Promise.resolve(data.result ? data.result.slice((params.page - 1) * 5, (params.page -
        1) * 5 + 5) : [])
    },
    async fetchUnbondingDelegations(context, params) {
      const {
        data
      } = await $ajax.get(`/staking/validators/${params.address}/unbonding_delegations`)
      if (isEmpty(data)) {
        return Promise.reject()
      }
      let result = [];
      if (!isEmpty(data.result)) {
        data.result.forEach(i => {
          i.entries.forEach(m => {
            result.push({
              entries: m,
              delegator_address: i.delegator_address,
              validator_address: i.validator_address
            })
          })
        })
      }

      result.sort((a, b) => {
        return b.entries.balance - a.entries.balance
      })
      context.commit("setUnbondingDelegationsTotal", result ? result.length : 0)
      return Promise.resolve(result ? result.slice((params.page - 1) * 5, (params.page -
        1) * 5 + 5) : [])
    },
    async fetchRedelegations(context, params) {
      const {
        data
      } = await $ajax.get(`/staking/redelegations?validator_from=${params.address}`)
      if (isEmpty(data)) {
        return Promise.reject()
      }
      let result = []
      if (!isEmpty(data.result)) {
        data.result.forEach(i => {
          i.entries.forEach(m => {
            result.push({
              entries: m,
              delegator_address: i.delegator_address,
              validator_dst_address: i.validator_dst_address,
              validator_src_address: i.validator_src_address
            })
          })
        })
      }

      result.sort((a, b) => {
        return b.entries.balance - a.entries.balance
      })
      context.commit("setRedelegationsTotal", result ? result.length : 0)
      return Promise.resolve(result ? result.slice((params.page - 1) * 5, (params.page -
        1) * 5 + 5) : [])
    },
    async fetchRedelegationsTo(context, params) {
      const {
        data
      } = await $ajax.get(`/staking/redelegations?validator_to=${params.address}`)
      if (isEmpty(data)) {
        return Promise.reject()
      }
      let result = []
      if (!isEmpty(data.result)) {
        data.result.forEach(i => {
          i.entries.forEach(m => {
            result.push({
              entries: m,
              delegator_address: i.delegator_address,
              validator_dst_address: i.validator_dst_address,
              validator_src_address: i.validator_src_address
            })
          })
        })
      }

      result.sort((a, b) => {
        return b.entries.balance - a.entries.balance
      })
      context.commit("setRedelegationsToTotal", result ? result.length : 0)
      return Promise.resolve(result ? result.slice((params.page - 1) * 5, (params.page -
        1) * 5 + 5) : [])
    },
    async fetchWithdrawAddress(context, address) {
      const {
        data
      } = await $ajax.get(`/distribution//delegators/${address}/withdraw_address`)
      if (isEmpty(data)) {
        throw new Error();
      }
      return Promise.resolve(data.result)
    },
    async fetchStakingPool(context) {
      const {
        data
      } = await $ajax.get(`staking/pool`)
      if (isEmpty(data)) {
        throw new Error();
      }
      return Promise.resolve(data.result)
    },
    async fetchRewards(context, address) {
      const {
        data
      } = await $ajax.get(`/distribution/delegators/${address}/rewards`)
      if (isEmpty(data)) {
        return Promise.reject()
      }
      context.commit("setRewards", data.result)
      return Promise.resolve(data.result)
    }
  }
};