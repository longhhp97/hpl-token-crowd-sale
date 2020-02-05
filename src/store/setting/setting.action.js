import Web3 from 'web3';

export default {
  async loadWeb3(context) {
    try {
      context.commit('setLoading', true);
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        context.commit('setWeb3', window.web3);
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        context.commit('setWeb3', window.web3);
      } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    } catch (error) {
      console.log(error);
    }
  },
  getAccount(context) {
    const { account } = context.state;
    setInterval(() => {
      if (window.ethereum.selectedAddress !== account) {
        context.commit('setAccount', window.ethereum.selectedAddress);
      }
    }, 500);
  },
  async getBalance(context, address) {
    try {
      const {
        eth: { getBalance },
        utils: { fromWei }
      } = context.state.web3;
      context.commit('setLoading', true);
      let balance = await getBalance(address);
      balance = fromWei(balance, 'ether');
      context.commit('setBalance', balance);
      return balance;
    } catch (error) {
      console.log(error);
    }
  }
};
