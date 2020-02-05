import Vue from 'vue';
import Vuex from 'vuex';

import crowdSale from './crowd-sale/crowd-sale.store';
import setting from './setting/setting.store';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    crowdSale,
    setting
  }
});
