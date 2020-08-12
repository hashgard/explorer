import {
  get,
  find,
  isEmpty
} from 'lodash';
import $ajax from '@/utils/ajax';

export default {
  namespaced: true,
  state: {
    pageSize: 20,
    currentPage: 1,
    totalCount: 0,
    list: [],
    holdersList: [],
    details: {},
    lastList: [],
    recordList: [],
    recordLastList: [],
    contractList: [],
    addressDelegators: [],
    addressRedelegations: [],
    addressUnbonding: [],
    load: false,
    txTotal: 0,
    recordLastPage: true,
    contractLastPage: true,
    txLastPage: true,
    holdersLastPage: true,
    addressDelegationsBalance: 0,
    addressDelegationsShares: 0
  },
  getters: {
    lastList: state => state.lastList.slice(0, 5),
    recordLastList: state => state.recordList.slice(0, 5)
  },
  mutations: {
    setTotalCount(state, data) {
      state.totalCount = data;
    },
    setList(state, list) {
      state.list = [...state.list, ...list];
    },
    setListEmpty(state) {
      state.list = [];
    },
    setHoldersList(state, list) {
      state.holdersList = [...state.holdersList, ...list];
    },
    setHoldersListEmpty(state) {
      state.holdersList = [];
    },
    setLastList(state, list) {
      state.lastList = list;
    },
    setRecordList(state, list) {
      state.recordList = [...state.recordList, ...list];
    },
    setRecordListEmpty(state) {
      state.recordList = [];
    },
    setContractList(state, list) {
      state.contractList = [...state.contractList, ...list];
    },
    setContractListEmpty(state) {
      state.contractList = [];
    },
    setDetails(state, data) {
      const details = state.details;
      const {
        txhash
      } = data;

      if (isEmpty(details[txhash])) {
        state.details = Object.assign({}, state.details, {
          [txhash]: data
        });
      }
    },
    setLoad(state, load) {
      state.load = load;
    },
    setTxTotal(state, data) {
      state.txTotal = data;
    },
    setRecordLastPage(state, data) {
      state.recordLastPage = data;
    },
    setContractLastPage(state, data) {
      state.contractLastPage = data;
    },
    setTxLastPage(state, data) {
      state.txLastPage = data;
    },
    setHoldersLastPage(state, data) {
      state.holdersLastPage = data;
    },
    setAddressDelegators(state, data) {
      state.addressDelegators = data
    },
    setAddressDelegationsBalance(state, data) {
      state.addressDelegationsBalance = data
    },
    setAddressDelegationsShares(state, data) {
      state.addressDelegationsShares = data
    },
    setAddressRedelegations(state, data) {
      state.addressRedelegations = data
    },
    setAddressUnbonding(state, data) {
      state.addressUnbonding = data
    }
  },
  actions: {
    async fetchTotalCount(
      context,
      params = {
        'message.action': 'send',
        page: 1
      }
    ) {
      context.commit('setLoad', true);

      const action = encodeURIComponent(`='${params['message.action']}'`);
      const {
        data
      } = await $ajax.get(`/txs?message.action=${action}&page=1`);

      context.commit('setLoad', false);

      if (isEmpty(data)) {
        throw new Error();
      }

      context.commit('setTotalCount', Number(data.total_count));
    },
    // async fetchList(
    //   context,
    //   params = {
    //     'message.action': 'send',
    //     page: 1,
    //   },
    // ) {
    //   params.limit = context.state.pageSize;
    //   context.commit('setLoad', true);

    //   const action = encodeURIComponent(`='${params['message.action']}'`);
    //   const { data } = await $ajax.get(
    //     `/txs?message.action=${action}&page=${params.page}&limit=${params.limit}`,
    //   );

    //   context.commit('setLoad', false);

    //   if (isEmpty(data)) {
    //     throw new Error();
    //   }

    //   context.commit('setTotalCount', Number(data.total_count));
    //   context.commit('setList', data.txs);
    // },
    async fetchList(context, params) {
      context.commit('setLoad', true);
      let url;
      if (params.id == '') {
        url = `/scene/txs/${params.module}/0/10/desc`;
      } else {
        url = `/scene/txs/${params.module}/${params.id}/10/desc`;
      }
      const {
        data
      } = await $ajax.get(url);

      context.commit('setLoad', false);

      if (isEmpty(data)) {
        throw new Error();
      }
      let result = [];
      data.result.forEach(i => {
        i.tx.id = i.id;
        result.push(i.tx);
      });
      context.commit('setList', result);
      let num = 0;
      context.state.list.forEach((item, index, arr) => {
        const eventsMessage = get(item, 'events', []).filter(i => i.type === 'message');
        const action =
          find(get(eventsMessage[0], 'attributes'), {
            key: 'action'
          }) || {};
        if (
          action.value == 'withdraw_delegator_reward' &&
          (
            index > 0 && index < arr.length - 1 ?
            item.txhash == arr[index - 1].txhash || item.txhash == arr[index + 1].txhash :
            (index == 0 && arr.length > 1) ?
            item.txhash == arr[index + 1].txhash :
            (
              (index == arr.length - 1 && arr.length > 1) ?
              item.txhash == arr[index - 1].txhash : false
            )
          )
        ) {
          item.index = num;
          if ((index > 0 && index < arr.length - 1) && num >= 1) {
            if (item.txhash != arr[index + 1].txhash) {
              num = 0
            } else {
              num += 1;
            }
          } else {
            num += 1;
          }
        } else {
          num = 0;
        }
      });
      if (data.result.length < 10) {
        context.commit('setTxLastPage', false);
      } else if (data.result.length >= 10 && data.result[data.result.length - 1].id == 1) {
        context.commit('setTxLastPage', false);
      } else {
        context.commit('setTxLastPage', true);
      }
    },
    // 获取所有交易
    async fetchAll(
      context,
      params = {
        page: 1
      }
    ) {
      context.commit('setLoad', true);

      const {
        data
      } = await $ajax.get(`/txs?message.action=%20CONTAINS%27%27&page=${params.page}&limit=20`);

      context.commit('setLoad', false);

      if (isEmpty(data)) {
        throw new Error();
      }

      context.commit('setTotalCount', Number(data.total_count));
      context.commit('setList', data.txs);
    },
    // 获取所有交易数量
    async fetchAllTotalAcount(
      context,
      params = {
        page: 1
      }
    ) {
      context.commit('setLoad', true);

      const {
        data
      } = await $ajax.get(`/txs?message.action=%20CONTAINS%27%27&page=${params.page}&limit=20`);

      context.commit('setLoad', false);

      if (isEmpty(data)) {
        throw new Error();
      }

      context.commit('setTotalCount', Number(data.total_count));
    },
    // 上链申请
    async fetchOrgApplyList(context) {
      const type = encodeURIComponent("CONTAINS'OrgApply'");

      context.commit('setLoad', true);

      const {
        data
      } = await $ajax.get(`/txs?submit_proposal.proposal_type=${type}`);

      context.commit('setLoad', false);
      context.commit('setTotalCount', Number(data.total_count));
      context.commit('setList', data.txs);

      return Promise.resolve(data);
    },
    async fetch(context, hash) {
      // check if existed;
      if (!isEmpty(context.state.details[hash])) {
        return Promise.resolve();
      }

      context.commit('setLoad', true);

      const {
        data
      } = await $ajax.get(`/txs/${hash}`);

      context.commit('setLoad', false);

      if (isEmpty(data)) {
        throw new Error();
      }

      context.commit('setDetails', data);

      return data;
    },
    async fetchLastList(context, config = {}) {
      const PAGE_SIZE = 5;
      const action = config.action || 'record';
      const totalCount = context.state.totalCount;
      const lastPage = Math.ceil(totalCount / PAGE_SIZE) || 1;
      const params = {
        'message.action': encodeURIComponent(`='${action}'`),
        limit: PAGE_SIZE,
        page: lastPage
      };

      context.commit('setLoad', true);

      const {
        data
      } = await $ajax.get('/txs', {
        params
      });

      if (isEmpty(data)) {
        context.commit('setLoad', false);
        throw new Error();
      }

      let txs = data.txs;

      if (txs.length < PAGE_SIZE && totalCount > PAGE_SIZE) {
        const prePageParams = {
          ...params,
          page: lastPage - 1
        };

        const {
          data: newData
        } = await $ajax.get('/txs', {
          params: prePageParams
        });

        if (isEmpty(newData)) {
          context.commit('setLoad', false);
          throw new Error();
        }

        txs = [...newData.txs, ...txs];
      }

      context.commit('setLoad', false);
      context.commit('setTotalCount', data.total_count);
      context.commit('setLastList', txs);
    },
    async fetchAllLastList(context) {
      const PAGE_SIZE = 5;
      const lastPage = 1;
      const params = {
        'message.action': '%20CONTAINS%27%27',
        limit: PAGE_SIZE,
        page: lastPage
      };

      context.commit('setLoad', true);

      const {
        data
      } = await $ajax.get('/txs', {
        params
      });

      if (isEmpty(data)) {
        context.commit('setLoad', false);
        throw new Error();
      }

      const txs = data.txs;

      // if (txs.length < PAGE_SIZE && totalCount > PAGE_SIZE) {
      //   const prePageParams = {
      //     ...params,
      //     page: lastPage - 1
      //   };
      //   var {
      //     data
      //   } = await $ajax.get("/txs", {
      //     params: prePageParams
      //   });
      //   if (isEmpty(data)) {
      //     context.commit("setLoad", false);
      //     throw new Error();
      //   }
      //   txs = [...data.txs, ...txs];
      // }
      context.commit('setLoad', false);
      context.commit('setTotalCount', data.total_count);
      context.commit('setLastList', txs);
    },
    // async fetchAddressTxList(
    //   context,
    //   params = {
    //     'message.action': 'send',
    //     page: 1,
    //   },
    // ) {
    //   const address = params['message.sender'];

    //   params.limit = 100;
    //   context.commit('setLoad', true);

    //   const action = params['message.action'];
    //   const sender = params['message.sender'];
    //   // 1. query txs as sender
    //   const senderData = await $ajax.get(
    //     `/txs?message.sender=${sender}&page=1&limit=${params.limit}`,
    //   );

    //   if (isEmpty(senderData.data)) {
    //     context.commit('setLoad', false);
    //     throw new Error();
    //   }

    //   // 2. query txs as recipient
    //   // params['message.recipient'] = params['message.sender'];
    //   // delete params['message.sender'];

    //   // const recipient = params['message.recipient'];
    //   // const recipientData = await $ajax.get(
    //   //   `/txs?message.recipient=${recipient}&page=1&limit=${params.limit}`,
    //   // );

    //   // if (isEmpty(recipientData.data)) {
    //   //   context.commit('setLoad', false);
    //   //   throw new Error();
    //   // }

    //   // // show action as receive in address page
    //   // const recipientList = recipientData.data.txs.filter(i => get(i,
    //   //   'events.1.attributes.0.value') === address);
    //   // const list = [...senderData.data.txs, ...recipientList];
    //   const list = [...senderData.data.txs];
    //   list.sort((a, b) => a.height - b.height);
    //   context.commit('setLoad', false);
    //   context.commit('setList', list);
    // },
    async fetchAddressTxList(context, params) {
      context.commit('setLoad', true);
      let url;
      if (params.id == '') {
        url = `/scene/txs/${params.address}/0/10/desc`;
      } else {
        url = `/scene/txs/${params.address}/${params.id}/10/desc`;
      }
      const {
        data
      } = await $ajax.get(url);

      context.commit('setLoad', false);

      if (isEmpty(data)) {
        throw new Error();
      }
      let result = [];
      data.result.forEach(i => {
        i.tx.id = i.id;
        result.push(i.tx);
      });
      context.commit('setList', result);
      let num = 0;
      context.state.list.forEach((item, index, arr) => {
        const eventsMessage = get(item, 'events', []).filter(i => i.type === 'message');
        const action =
          find(get(eventsMessage[0], 'attributes'), {
            key: 'action'
          }) || {};
        if (
          action.value == 'withdraw_delegator_reward' &&
          (
            index > 0 && index < arr.length - 1 ?
            item.txhash == arr[index - 1].txhash || item.txhash == arr[index + 1].txhash :
            (index == 0 && arr.length > 1) ?
            item.txhash == arr[index + 1].txhash :
            (
              (index == arr.length - 1 && arr.length > 1) ?
              item.txhash == arr[index - 1].txhash : false
            )
          )
        ) {
          item.index = num;
          if ((index > 0 && index < arr.length - 1) && num >= 1) {
            if (item.txhash != arr[index + 1].txhash) {
              num = 0
            } else {
              num += 1;
            }
          } else {
            num += 1;
          }
        } else {
          num = 0;
        }
      });
      if (data.result.length < 10) {
        context.commit('setTxLastPage', false);
      } else {
        context.commit('setTxLastPage', true);
      }
    },
    // 首页交易总量
    async fetchTx(context) {
      const {
        data
      } = await $ajax.get('/staking/total/txs');

      if (isEmpty(data)) {
        throw new Error();
      }

      context.commit('setTxTotal', data.result.total);

      return Promise.resolve(data);
    },
    async fetchOrgDetail(_, id) {
      const {
        data
      } = await $ajax.get(`/org/detail/${id}`);

      if (isEmpty(data)) {
        return Promise.reject();
      }

      return Promise.resolve(data);
    },
    async fetchGridDetail(context, params) {
      const {
        data
      } = await $ajax.get(`/grid999/grid/detail/${params.dappId}/${params.gridId}`);
      if (isEmpty(data)) {
        return Promise.reject();
      }
      return Promise.resolve(data);
    },
    async fetchHoldersList(context, params) {
      context.commit('setLoad', true);
      let url;
      if (params.id == '') {
        url = `/auth/holders/${params.denom}?start_id=all&limit=20`;
      } else {
        url = `/auth/holders/${params.denom}?start_id=${params.id}&limit=20`;
      }
      const {
        data
      } = await $ajax.get(url);

      context.commit('setLoad', false);

      if (isEmpty(data)) {
        throw new Error();
      }
      let result = [];
      data.result.forEach(i => {
        result.push({
          id: i.split(':')[0],
          address: i.split(':')[1]
        });
      });
      context.commit('setHoldersList', result);
      if (data.result.length < 20) {
        context.commit('setHoldersLastPage', false);
      } else if (data.result.length >= 20 && parseInt(data.result[data.result.length - 1].split(':')[0]) == 0) {
        context.commit('setHoldersLastPage', false);
      } else {
        context.commit('setHoldersLastPage', true);
      }
    },
    async fetchAddressDelegators(context, address) {
      const {
        data
      } = await $ajax.get(`/staking/delegators/${address}/delegations`);
      if (isEmpty(data)) {
        throw new Error();
      }
      data.result.sort((a, b) => {
        return b.balance - a.balance
      })
      context.commit('setAddressDelegators', data.result)
      let balance = 0,
        shares = 0;
      data.result.forEach(i => {
        balance += parseFloat(i.balance)
        shares += parseFloat(i.shares)
      })
      context.commit('setAddressDelegationsBalance', balance)
      context.commit('setAddressDelegationsShares', shares)
    },
    async fetchAddressUnbonding(context, address) {
      const {
        data
      } = await $ajax.get(`/staking/delegators/${address}/unbonding_delegations`);
      if (isEmpty(data)) {
        throw new Error();
      }
      let result = []
      data.result.forEach(i => {
        i.entries.forEach(m => {
          result.push({
            entries: m,
            delegator_address: i.delegator_address,
            validator_address: i.validator_address,
          })
        })
      })
      context.commit('setAddressUnbonding', data.result)
    },
    async fetchAddressRedelegations(context, address) {
      const {
        data
      } = await $ajax.get(`/staking/redelegations?delegator=${address}`);
      if (isEmpty(data)) {
        throw new Error();
      }
      let result = []
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
      context.commit('setAddressRedelegations', result)
    }
  }
};