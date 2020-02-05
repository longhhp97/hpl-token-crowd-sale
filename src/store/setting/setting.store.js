import actions from './setting.action';

const initialState = {
  loading: false,
  web3: null,
  account: null,
  balance: 0,
  gas_price: '20000000000' //20gwei
};

const setting = {
  namespaced: true,
  state: initialState,
  mutations: {
    setLoading(state, payload) {
      state.loading = payload;
    },
    setWeb3(state, payload) {
      state.web3 = payload;
      state.loading = false;
    },
    setAccount(state, payload) {
      state.account = payload;
    },
    setBalance(state, payload) {
      state.balance = payload;
      state.loading = false;
    }
  },
  getters: {},
  actions: actions
};

export default setting;
