import {
  get,
  isEmpty,
} from 'lodash';
import axios from 'axios';
import $ajax from '@/utils/ajax';
import Codec from '@/utils/cdec';
import {
  NetInfo
} from '@/constants';

export default {
  namespaced: true,
  state: {
    pageSize: 20,
    currentPage: 1,
    lastHeight: 0,
    list: [],
    details: {},
    proposers: {},
    validatorsets: {},
    homeTxTotal: 0,
  },
  getters: {
    lastList: state => state.list.slice(0, 5),
    list: ({
      list,
      details,
      validatorsets,
    }) => list.map((item) => {
      const height = get(item, 'header.height');

      if (isEmpty(details[height])) {
        return item;
      }

      const validators = get(validatorsets, [height, 'validators'], []);
      const block = get(details, [height, 'block']);

      return {
        ...item,
        block,
        validators,
      };
    }),
  },
  mutations: {
    setCurrentPage(state, page) {
      state.currentPage = page;
    },
    setLastHeight(state, height) {
      height = Number(height);
      state.lastHeight = height;
    },
    setList(state, list) {
      state.list = list;
    },
    setDetails(state, data) {
      state.details = Object.assign({}, data, state.details);
    },
    setProposers(state, data) {
      state.proposers = Object.assign({}, data, state.proposers);
    },
    setValidatorsets(state, data) {
      state.validatorsets = Object.assign({}, data, state.validatorsets);
    },
    sethomeTxTotal(state, data) {
      state.homeTxTotal = data;
    },
  },
  actions: {
    async fetchList(
      context, {
        minHeight,
        maxHeight,
        page,
      } = {
        page: 1,
      },
    ) {
      const {
        data
      } = await axios.get(`${NetInfo.node}/blockchain`, {
        params: {
          minHeight,
          maxHeight,
          random: new Date().getTime(),
        },
      });

      const result = get(data, 'result');

      if (isEmpty(result)) {
        throw new Error();
      }

      const list = get(result, 'block_metas');
      const lastHeight = get(result, 'last_height');

      page && context.commit('setCurrentPage', page);
      context.commit('setList', list);
      context.commit('setLastHeight', lastHeight);

      // 延迟1秒获取区块详细信息，防止最新区块未更新
      setTimeout(() => {
        list.forEach((item) => {
          const height = get(item, 'header.height');
          const details = context.state.details;

          if (isEmpty(details[height])) {
            context.dispatch('fetchDetail', item.header.height);
          }
        });
      }, 1000);

      return data;
    },
    async fetchLatest(context) {
      const {
        data
      } = await $ajax.get('/blocks/latest');
      const latestHeight = get(data, 'block.header.height');
      // 设置首页交易量
      const homeTxTotal = get(data, 'block.header.total_txs');

      context.commit('setLastHeight', latestHeight);
      context.commit('sethomeTxTotal', homeTxTotal);

      return data;
    },
    async fetchValidatorset(context, height) {
      const {
        data
      } = await $ajax.get(`/validatorsets/${height}`);
      const result = data.result;

      if (!isEmpty(result)) {
        context.commit('setValidatorsets', {
          [height]: result
        });

        // find proposer of this block
        const block = context.state.details[height];
        const consHex = get(block, 'block.header.proposer_address');
        const consAddr = Codec.Bech32.toBech32('gardvalcons', consHex);
        const proposer = result.validators.find(v => v.address === consAddr);

        context.commit('setProposers', {
          [height]: proposer
        });
      }
    },
    async fetchDetail(context, height) {
      if (!isEmpty(context.state.details[height])) {
        return context.state.details[height];
      }

      const {
        data
      } = await $ajax.get(`/blocks/${height}`);

      if (!isEmpty(data)) {
        context.dispatch('fetchValidatorset', height);
        context.commit('setDetails', {
          [height]: data
        });
      }

      return data;
    }
  },
};
