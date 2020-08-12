import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '@/styles/element-variables.scss';
import Vue from 'vue';
import Vuex from 'vuex';
import ElementUI from 'element-ui';
import App from './App';
import router from './router';
import VueI18n from 'vue-i18n';
import rootStore from './store/index';

import Card from '@/components/Card';
import Link from '@/components/Link';
import TransactionList from '@/components/TransactionList';
import ValidatorList from '@/components/ValidatorList';
import SubTitle from './components/SubTitle';
import DataItem from '@/components/DataArea/item';
import Amount from '@/components/DataArea/Amount';

import * as filters from '@/utils/filters';
import {
  en,
  zh
} from '@/constants';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(Vuex);
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]));
Vue.use(VueI18n);

const lang = localStorage.getItem('borwser-lang') ||
  window.navigator.language ||
  window.navigator.userLanguage;

const i18n = new VueI18n({
  // locale: lang.match('en') ? 'en' : 'zh',
  locale: 'en',
  messages: {
    en,
    zh,
  },
});

const store = new Vuex.Store(rootStore);

// get blockchain basic info
store.dispatch('basic/fetchNetInfo');
// 注册全局组件
Vue.component('Card', Card);
Vue.component('hg-link', Link);
Vue.component('transaction-list', TransactionList);
Vue.component('validator-list', ValidatorList);
Vue.component('sub-title', SubTitle);
Vue.component('data-item', DataItem);
Vue.component('data-amount', Amount);

new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
}).$mount('#app');