import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home';
import Blocks from './views/Blocks';
import BlockDetail from './views/BlockDetail';
import Transactions from './views/Transactions';
import TransactionDetail from './views/TransactionDetail';
import AddressDetail from './views/AddressDetail';
import Proposals from './views/Proposals';
import ProposalDetail from './components/Proposals/Detail';
import Validators from './views/Validators';
import ValidatorDetail from './views/ValidatorDetail';
import NotFound from './views/NotFound';
import View from '@/components/View';
import Alliance from '@/views/Alliances';
import AllianceDetail from '@/views/AllianceDetail';
import AuthHolders from '@/views/AuthHolders';

// 解决两次访问相同路由地址报错
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
Vue.use(Router);

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/block',
      component: View,
      children: [{
          path: '',
          name: 'blocks',
          component: Blocks,
        },
        {
          path: '/block/:id',
          name: 'blockDetail',
          component: BlockDetail,
        },
      ],
    },
    {
      path: '/txs',
      name: 'transactions',
      component: Transactions,
    },
    {
      path: '/tx/:hash',
      name: 'transactionDetail',
      component: TransactionDetail,
    },
    {
      path: '/address/:address',
      name: 'addressDetail',
      component: AddressDetail,
    },
    {
      path: '/proposal',
      component: View,
      children: [{
          path: '',
          name: 'proposals',
          component: Proposals,
        },
        {
          path: ':id',
          name: 'proposalDetail',
          component: ProposalDetail,
        },
      ],
    },
    {
      path: '/validator',
      component: View,
      children: [{
          path: '',
          name: 'validators',
          component: Validators,
        },
        {
          path: ':address',
          name: 'validatorDetail',
          component: ValidatorDetail,
        },
      ],
    },
    {
      path: '/alliance',
      component: Alliance,
    },
    {
      path: '/alliance/:id',
      component: AllianceDetail,
    },
    {
      path: '/holders',
      component: AuthHolders
    },
    {
      path: '*',
      name: 'notFound',
      component: NotFound,
    },
  ],
});