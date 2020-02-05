<template>
  <div class="main">
    <h1>HPLToken CROWD SALE</h1>
    <h2 style="font-style:italic;margin-top: 20px">Ends in</h2>
    <flip-countdown :deadline="deadline" v-if="deadline"></flip-countdown>
    <h2 style="margin-top: 40px">LIMITED CAP: {{ cap }} wei = {{ capInEth }} ETH</h2>
    <a-progress :percent="percent" status="active" />

    <div style="margin: 40px">
      <h3>Price: 1 HPL = {{ price }} ETH</h3>
      <a-form layout="inline" :form="form" @submit.prevent="handleSubmit">
        <a-form-item label="ETH Amount">
          <a-input
            v-decorator="[
              'amount',
              {
                rules: [
                  { required: true, message: 'Please input the amount!' },
                  {
                    validator: this.checkAmount
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">
            Submit
          </a-button>
        </a-form-item>
      </a-form>
      <i>**Transaction Fee: {{ fee }}**</i>
    </div>

    <h3>
      Your address <span class="address">{{ account }}</span>
    </h3>
    <h3>Balance: {{ balance }} ETH</h3>

    <!-- LOADER -->
    <div :class="{ cover: loading, hide: !loading }">
      <h1 class="info">Waiting for Metamask</h1>
      <a-spin size="large" :spinning="loading" />
    </div>
  </div>
</template>

<script>
import FlipCountdown from 'vue2-flip-countdown';
import moment from 'moment';
import { mapState, mapActions } from 'vuex';
import BN from 'bn.js';

export default {
  name: 'hello-world',
  components: {
    FlipCountdown
  },
  data() {
    return {
      form: this.$form.createForm(this),
      fee: null
    };
  },
  mounted() {
    this.loadWeb3();
    this.getAccount();
  },
  updated() {
    if (this.web3 && this.currentAccount !== this.account) {
      this.getBalance(this.account);
      this.currentAccount = this.account;
    }
    if (this.web3 && !this.crowdSale) {
      const {
        utils: { fromWei }
      } = this.web3;
      this.loadCrowdSale().then(() => {
        this.estimateBuyTokensGas().then(val => {
          const gas = new BN(val);
          const g_price = new BN(this.gas_price);
          this.fee = fromWei((gas * g_price).toString());
        });
      });
    }
  },
  computed: {
    ...mapState('setting', ['loading', 'web3', 'account', 'balance', 'gas_price']),
    ...mapState('crowdSale', ['crowdSale', 'rate', 'wallet', 'weiRaised', 'cap', 'openingTime', 'closingTime', 'investorMinCap', 'investorHardCap']),
    deadline() {
      if (this.closingTime) {
        return moment(Number(this.closingTime) * 1000).format('YYYY-MM-DD hh:mm:ss');
      }
      return null;
    },
    percent() {
      if (this.weiRaised && this.cap) {
        const raised = new BN(this.weiRaised);
        const cap = new BN(this.cap);
        return (raised * 100) / cap; //not test
      }
      return 0;
    },
    price() {
      if (this.rate) {
        return 1 / this.rate;
      }
      return 0;
    },
    capInEth() {
      if (this.cap && this.web3) {
        return this.web3.utils.fromWei(this.cap.toString(), 'ether');
      }
      return 0;
    }
  },
  methods: {
    ...mapActions('setting', ['loadWeb3', 'getAccount', 'getBalance']),
    ...mapActions('crowdSale', ['loadCrowdSale', 'estimateBuyTokensGas']),
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('form', values);
        }
      });
    },
    checkAmount(rule, value, callback) {
      if (this.fee && this.web3 && this.investorMinCap && this.investorHardCap) {
        const {
          utils: { fromWei }
        } = this.web3;
        const val = parseFloat(value);
        const fee = parseFloat(this.fee);
        const balance = parseFloat(this.balance);
        const min = parseFloat(fromWei(this.investorMinCap));
        const max = parseFloat(fromWei(this.investorHardCap));
        console.log(val + fee, balance, min, max);

        if (val + fee > balance) {
          callback('Insufficent balance');
        }

        if (val < min) {
          callback('Minimum 0.002 ETH');
        }

        if (val > max) {
          callback('Maximum 50 ETH');
        }
      }
      callback();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.main {
  padding: 40px 20%;
}
.cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #fff, $alpha: 0.8);
}
.info {
  margin: 40px;
}
.hide {
  display: none;
}
.address {
  font-size: 20px;
  font-style: italic;
}
</style>
