import abi from '@/helpers/crowd-sale.abi.json';

export const methods = [
  'buyTokens',
  'cap',
  'capReached',
  'closingTime',
  'finalize',
  'finalized',
  'hasClosed',
  'isOpen',
  'openingTime',
  'rate',
  'token',
  'wallet',
  'weiRaised',
  'investorMinCap',
  'investorHardCap',
  'contributionOf'
];

const fieldPayload = (key, value) => {
  return {
    key,
    value
  };
};

export default {
  async loadCrowdSale(context) {
    try {
      const {
        web3: {
          eth: { Contract }
        },
        account,
        gas_price
      } = context.rootState.setting;
      const { address } = context.state;

      const crowdSale = new Contract(abi, address, { from: account, gasPrice: gas_price });

      context.commit('setField', fieldPayload('crowdSale', crowdSale));
      context.dispatch('getRate');
      context.dispatch('getWallet');
      context.dispatch('getCap');
      context.dispatch('getOpeningTime');
      context.dispatch('getClosingTime');
      context.dispatch('getWeiRaised');
      context.dispatch('getInvestorMinCap');
      context.dispatch('getInvestorHardCap');

      return crowdSale;
    } catch (error) {
      console.log(error);
    }
  },
  async updateInfo(context) {
    const { account } = context.rootState.setting;
    context.dispatch('getCap');
    context.dispatch('getWeiRaised');

    context.dispatch('setting/getBalance', account, { root: true });
  },
  async buyTokens(context, value) {
    try {
      context.commit('setField', fieldPayload('loading', true));
      const {
        account,
        web3: {
          utils: { toWei }
        }
      } = context.rootState.setting;
      const { crowdSale } = context.state;
      const result = await crowdSale.methods.buyTokens(account).send({ value: toWei(value, 'ether') });
      return result;
    } catch (error) {
      console.log(error);
    }
  },

  async getRate(context) {
    try {
      const { crowdSale } = context.state;
      const result = await crowdSale.methods.rate().call();
      context.commit('setField', fieldPayload('rate', result));
      return result;
    } catch (error) {
      console.log(error);
    }
  },
  async getWallet(context) {
    try {
      const { crowdSale } = context.state;
      const result = await crowdSale.methods.wallet().call();
      context.commit('setField', fieldPayload('wallet', result));
      return result;
    } catch (error) {
      console.log(error);
    }
  },
  async getWeiRaised(context) {
    try {
      const { crowdSale } = context.state;
      const result = await crowdSale.methods.weiRaised().call();
      context.commit('setField', fieldPayload('weiRaised', result));
      return result;
    } catch (error) {
      console.log(error);
    }
  },
  async getCap(context) {
    try {
      const { crowdSale } = context.state;
      const result = await crowdSale.methods.cap().call();
      context.commit('setField', fieldPayload('cap', result));
      return result;
    } catch (error) {
      console.log(error);
    }
  },
  async getInvestorMinCap(context) {
    try {
      const { crowdSale } = context.state;
      const result = await crowdSale.methods.investorMinCap().call();
      context.commit('setField', fieldPayload('investorMinCap', result));
      return result;
    } catch (error) {
      console.log(error);
    }
  },
  async getInvestorHardCap(context) {
    try {
      const { crowdSale } = context.state;
      const result = await crowdSale.methods.investorHardCap().call();
      context.commit('setField', fieldPayload('investorHardCap', result));
      return result;
    } catch (error) {
      console.log(error);
    }
  },
  async getContributionOf(context, address) {
    try {
      const { crowdSale } = context.state;
      const result = await crowdSale.methods.contributionOf(address).call();
      context.commit('setField', fieldPayload('contributionOf', result));
      return result;
    } catch (error) {
      console.log(error);
    }
  },
  async getOpeningTime(context) {
    try {
      const { crowdSale } = context.state;
      const result = await crowdSale.methods.openingTime().call();
      context.commit('setField', fieldPayload('openingTime', result));
      return result;
    } catch (error) {
      console.log(error);
    }
  },
  async getClosingTime(context) {
    try {
      const { crowdSale } = context.state;
      const result = await crowdSale.methods.closingTime().call();
      context.commit('setField', fieldPayload('closingTime', result));
      return result;
    } catch (error) {
      console.log(error);
    }
  },
  async estimateBuyTokensGas(context) {
    try {
      const {
        web3: {
          utils: { toWei }
        }
      } = context.rootState.setting;
      const { address } = context.state;
      const { crowdSale } = context.state;
      const result = await crowdSale.methods.buyTokens(address).estimateGas({ value: toWei('1', 'ether') });
      return result;
    } catch (error) {
      console.log(error);
    }
  }
};
