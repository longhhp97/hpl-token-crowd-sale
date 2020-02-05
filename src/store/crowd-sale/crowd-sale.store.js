import actions from './crowd-sale.action';

const initialState = {
  loading: false,
  crowdSale: null,

  //crowd-sale props
  address: '0x184f37E511F99F921Da8bc935D97309c5B6C3cDE',
  rate: null,
  wallet: null,
  weiRaised: null,
  //capped
  cap: null,
  investorMinCap: null,
  investorHardCap: null,
  contributionOf: null,
  //timed
  openingTime: null,
  closingTime: null
};

const crowdSale = {
  namespaced: true,
  state: initialState,
  mutations: {
    setField(state, { key, value }) {
      state[key] = value;
      state.loading = false;
    }
  },
  getters: {},
  actions
};

export default crowdSale;
