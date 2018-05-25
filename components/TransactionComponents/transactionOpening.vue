<template>
    <div class="transactionContainer">
        <div v-if="loader" class="centerSpinner">
            <atom-spinner :animation-duration="1000" :size="100" :color="'#fd7e14'"  />
        </div>
        
        <b-card no-body v-else>
            <b-tabs card>

                <b-tab class="tPanel" active>
                    <template slot="title"><strong>Wallets</strong></template>
                    <b-tabs class="test" pills card vertical>
                        <div v-for="(wallet, index) in wallets" :key="'wallet' + index">
                            <b-tab :title="wallet.name" title-link-class="black-color">
                                <form>
                                    <div v-if="wallet.form[0]">
                                        <div class="form-group" v-for="(balance, i) in wallet.form[0].sub_details" :key="'balance' + i">
                                            <b-row :class="wallet.name.replace(/[^A-Z0-9]+/ig, '-').toLowerCase()" style="margin-bottom:5px;" >
                                                <b-col style="padding-right:5px;">
                                                    <b-form-select v-model="balance.currency_id" size="sm" class="inputWallet" required >
                                                        <option v-for="(currencytype, index) in wallet.wallet_currencies" :value="currencytype.currency_id" :disabled="disabledOption(currencytype.currency_id, wallet.form[0].sub_details)" :key="'walletOption' + index">{{ currencytype.currency.ticker_default }} - {{ currencytype.currency.name }}</option>	
                                                    </b-form-select>
                                                </b-col>
                                                <b-col style="padding-left:5px;">
                                                    <vue-autonumeric style="width:171px;" v-model.number="balance.amount" :options="{decimalPlaces: getDecimal(balance.currency_id, wallet.wallet_currencies), minimumValue: '0' }" :placeholder="'Enter amount'"  class="text-right pr-3 form-control"></vue-autonumeric>
                                                    <a @click="removeCurrency(wallet, i, 'wallet')"><i class="fa fa-minus-square"></i></a>
                                                </b-col>
                                            </b-row>
                                        </div>
                                    </div>
                                    
                                    <b-row v-if="currencyWalletTotal(wallet)">
                                        <b-col class="addressAdd">
                                            <a @click="addAsset('wallet', wallet.name.replace(/[^A-Z0-9]+/ig, '-').toLowerCase(), wallet, index)"><i class="fa fa-plus-square"></i> Add Asset</a>
                                        </b-col>
                                    </b-row>
                                </form>
                            </b-tab>
                        </div>
                    </b-tabs>
                </b-tab>

                <b-tab class="tPanel">
                    <template slot="title"><strong>Exchanges</strong></template>
                    <b-tabs pills card vertical>
                        <div v-for="(exchange, index) in exchanges" :key="'exchange' + index">
                            <b-tab :title="exchange.name" title-link-class="black-color">
                                <form>
                                    <div v-if="exchange.form[0]">
                                        <div class="form-group" v-for="(balance, i) in exchange.form[0].sub_details" :key="'balance' + i">
                                            <b-row :class="exchange.name.replace(/[^A-Z0-9]+/ig, '-').toLowerCase()" style="margin-bottom:5px;" >
                                                <b-col style="padding-right:5px;">
                                                    <b-form-select v-model="balance.currency_id" size="sm" class="inputExchange" required >
                                                        <option v-for="(currencytype, index) in exchange.exchange_currencies" :value="currencytype.currency_id" :disabled="disabledOption(currencytype.currency_id, exchange.form[0].sub_details)" :key="'exchangeOption' + index">{{ currencytype.currency.ticker_default }} - {{ currencytype.currency.name }}</option>   
                                                    </b-form-select>
                                                </b-col>
                                                <b-col style="padding-left:5px;">
                                                    <vue-autonumeric style="width:171px;" v-model.number="balance.amount" :options="{decimalPlaces: getDecimal(balance.currency_id, exchange.exchange_currencies), minimumValue: '0' }" :placeholder="'Enter amount'"  class="text-right pr-3 form-control"></vue-autonumeric>
                                                    <a @click="removeCurrency(exchange, i, 'exchange')"><i class="fa fa-minus-square"></i></a>
                                                </b-col>
                                            </b-row>
                                        </div>
                                    </div>
                                    
                                    <b-row v-if="currencyExchangeTotal(exchange)">
                                        <b-col class="addressAdd">
                                            <a @click="addAsset('exchange', exchange.name.replace(/[^A-Z0-9]+/ig, '-').toLowerCase(), exchange, index)"><i class="fa fa-plus-square"></i> </a> Add Asset
                                        </b-col>
                                    </b-row>
                                </form>
                            </b-tab>
                        </div>
                    </b-tabs> 
                </b-tab>

                <b-tab class="tPanel">
                    <template slot="title"><strong>Bank Accounts</strong></template>
                    <b-tabs pills card vertical>
                        <div v-for="(account, index) in bankAccounts" :key="'account' + index">
                            <b-tab :title="account.bank_name" title-link-class="black-color">
                                <form>
                                    <div v-if="account.form[0]">
                                        <div class="form-group" v-for="(balance, i) in account.form[0].sub_details" :key="'balance' + i">
                                            <b-row :class="account.bank_name.replace(/[^A-Z0-9]+/ig, '-').toLowerCase()" style="margin-bottom:5px;" >
                                                <b-col style="padding-right:5px;">
                                                    <b-form-select v-model="balance.currency_id" size="sm" class="inputAccount" required >
                                                        <option v-for="(currencytype, index) in fiat_currencies" :value="currencytype.id" :disabled="disabledOption(currencytype.id, account.form[0].sub_details)" :key="'accountOption' + index">{{ currencytype.ticker_default }} - {{ currencytype.name }}</option>   
                                                    </b-form-select>
                                                </b-col>
                                                <b-col style="padding-left:5px;">
                                                    <vue-autonumeric style="width:171px;" v-model.number="balance.amount" :options="{decimalPlaces: getDecimal(balance.currency_id, fiat_currencies), minimumValue: '0' }" :placeholder="'Enter amount'"  class="text-right pr-3 form-control"></vue-autonumeric>
                                                    <a @click="removeCurrency(account, i, 'account')"><i class="fa fa-minus-square"></i></a>
                                                </b-col>
                                            </b-row>
                                        </div>
                                    </div>
                                    
                                    <b-row v-if="currencyAccountTotal(account)">
                                        <b-col class="addressAdd">
                                            <a @click="addAsset('account', account.bank_name.replace(/[^A-Z0-9]+/ig, '-').toLowerCase(), account, index)"><i class="fa fa-plus-square"></i> </a> Add Asset
                                        </b-col>
                                    </b-row>
                                </form>
                            </b-tab>
                        </div>
                    </b-tabs>
                </b-tab>

            </b-tabs>
        </b-card>
    </div>
</template>

<style>
.centerSpinner{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    /* also add vendor prefixes to support old versions */
}
.black-color{
    color: #000;
}
.tPanel{
    padding:8px;
}
.tPanel .card-header{
    padding:9px 10px;
    border:1px solid #DEE2E6;
    border-radius: 3px !important;
    width:200px;
}
.tPanel .card-header.border-bottom-0{
    border-bottom-width: 1px !important;
}
.tPanel .card-header .nav-item a{
    line-height:16px;
    padding: 9px 12px 11px;
}

</style>

<script>
import {AtomSpinner} from 'epic-spinners';
import {VMoney} from 'v-money';
import VueAutonumeric from 'vue-autonumeric';

export default {
    props: ['walletsProps', 'exchangesProps', 'bankAccountsProps', 'dataTransactionProps'],
    data() {
		return {
            loader: true,
            status: null,
            message: '',
            duplicate: 0,
            assetWallet: 0,
            assetExchange: 0,
            assetBankAccount: 0,
            subDetail: {
                currencyId: null,
                amount: null
            },
            walletBalance: {
                id: null,
                subDetail: []
            },
            exchangeBalance: {
                id: null,
                subDetail: []
            },
            accountBalance: {
                id: null,
                subDetail: []
            },
            viewSettings: {

            },
            form: {
                opening_balances: []
            },
            wallets: this.walletsProps,
            exchanges: this.exchangesProps,
            bankAccounts: this.bankAccountsProps,
            dataTransaction: this.dataTransactionProps,
            digital_currencies: [],
            fiat_currencies: [],
        }
    },
    components: {
      AtomSpinner,
      VMoney,
      VueAutonumeric,
    },
    // async data

    beforeMount: async function() {
        if (!this.exchanges) {
            this.axios.get('/exchange')
            .then(response => {
                this.exchanges = response.data.data

                // add object form and totalcurrency
                $.each(this.exchanges, function(index, value){
                    Vue.set(value, 'form', [])
                    Vue.set(value, 'totalCurrency', 0)
                })
                this.loader = false
            }).catch(error => {
                console.log(error)
            })
        }else{
            // add object form and totalcurrency
            $.each(this.exchanges, function(index, value){
                Vue.set(value, 'form', [])
                Vue.set(value, 'totalCurrency', 0)
            })
            this.loader = false
        }

        if (!this.bankAccounts) {
            this.axios.get('/account')
            .then(response => {
                this.bankAccounts = response.data.data

                // add object form and totalcurrency
                $.each(this.bankAccounts, function(index, value){
                    Vue.set(value, 'form', [])
                    Vue.set(value, 'totalCurrency', 0)
                })
                this.loader = false
            }).catch(error => {
                console.log(error)
            })
        }else{
            // add object form and totalcurrency
            $.each(this.bankAccounts, function(index, value){
                Vue.set(value, 'form', [])
                Vue.set(value, 'totalCurrency', 0)
            })
            this.loader = false
        }

        if (!this.wallets) {
            this.axios.get('/wallet')
            .then(response => {
                this.wallets = response.data.data
                // add object form and totalcurrency
                $.each(this.wallets, function(index, value){
                    Vue.set(value, 'form', [])
                    Vue.set(value, 'totalCurrency', 0)
                })
                this.loader = false
            }).catch(error => {
                console.log(error)
            })
        }else{
            // add object form and totalcurrency
            $.each(this.wallets, function(index, value){
                Vue.set(value, 'form', [])
                Vue.set(value, 'totalCurrency', 0)
            })
            this.loader = false
        }
    },
    created() {
        // get data digital currency only
        // this.axios.get('/currency/show/filter?classification=digital')
        //     .then(response => {
        //      this.digital_currencies = response.data.data
        //      this.loader = false
        //     }).catch(error => {
        //      console.log(error)
        //     })

        // get data fiat currency only
        this.axios.get('/currency/show/filter?classification=fiat')
            .then(response => {
             this.fiat_currencies = response.data.data
             this.loader = false
            }).catch(error => {
             console.log(error)
            })

        //Listen to save event from any component .ex from parent
        this.$eventHub.$on('eventSaveTransaction', this.savePost)
        this.$eventHub.$on('eventEditTransaction', this.editPost)
    },
    mounted () {
        // assign data when update
        if (this.dataTransaction) {
            this.dataTransaction.transactionable.details.forEach((val) => {
                if (val.balanceable_type == 'App\\Models\\Wallet') {
                    let opening_balances = {
                        "wallet_id": val.container.id,
                        "sub_details" : []
                    }
                    this.wallets.forEach((item) => {
                        if (item.id == val.container.id) {
                            item.form.push(opening_balances)
                            val.sub_details.forEach((i) => {
                                item.totalCurrency++
                                this.assetWallet++
                                let sub = {
                                    "currency_id": i.id,
                                    "amount": parseInt(i.pivot.amount)
                                }
                                item.form[0].sub_details.push(sub)
                            })
                        }
                    })
                } else if (val.balanceable_type == 'App\\Models\\Exchange') {
                    let opening_balances = {
                        "exchange_id": val.container.id,
                        "sub_details" : []
                    }
                    this.exchanges.forEach((item) => {
                        if (item.id == val.container.id) {
                            item.form.push(opening_balances)
                            val.sub_details.forEach((i) => {
                                item.totalCurrency++
                                this.assetExchange++
                                let sub = {
                                    "currency_id": i.id,
                                    "amount": parseInt(i.pivot.amount)
                                }
                                item.form[0].sub_details.push(sub)
                            })
                        }
                    })
                } else {
                    let opening_balances = {
                        "account_id": val.container.id,
                        "sub_details" : []
                    }
                    this.bankAccounts.forEach((item) => {
                        if (item.id == val.container.id) {
                            item.form.push(opening_balances)
                            val.sub_details.forEach((i) => {
                                item.totalCurrency++
                                this.assetBankAccount++
                                let sub = {
                                    "currency_id": i.id,
                                    "amount": parseInt(i.pivot.amount)
                                }
                                item.form[0].sub_details.push(sub)
                            })
                        }
                    })
                }
            })
        }
    },
    methods: {
        addAsset(type, name, source, index){
            let self = this;
            if($(name).length > 0){

                $(name).each(function(index){
                    //check balance if empty
                    let balance = self.balance.filter(function (elm) {
                        console.log(index)
                        if (elm.id == index) return elm 
                    })

                    console.log(balance)
                })
            }else{
                let currency_id = 0

                // add flag for adding currency
                switch(type) {
                    case 'wallet':
                        this.assetWallet++
                        currency_id = source.wallet_currencies[0].currency_id
                        break;
                    case 'exchange':
                        this.assetExchange++
                        currency_id = source.exchange_currencies[0].currency_id
                        break;
                    default:
                        this.assetBankAccount++
                        currency_id = this.fiat_currencies[0].id
                }

                if (source.form.length == 0) {
                    // increment currency length identifier
                    source.totalCurrency++

                    // create first object for currencies amount
                    let opening_balances = {
                        [type+"_id"]: source.id,
                        "sub_details" : [{
                            "currency_id": currency_id,
                            "amount": 1,
                        }]
                    }
                    source.form.push(opening_balances)
                } else {
                    // increment currency length identifier
                    source.totalCurrency++

                    // create object for currencies amount
                    let opening_balances = {
                        "currency_id": currency_id,
                        "amount": 1,
                    }

                    // add object to data form
                    source.form[0].sub_details.push(opening_balances)
                }
			}
        },
        removeCurrency(source, i, type) {
            // decrease flag for adding currency
            switch(type) {
                case 'wallet':
                    this.assetWallet--
                    break;
                case 'exchange':
                    this.assetExchange--
                    break;
                default:
                    this.assetBankAccount--
            }

            // remove data currency
            source.form[0].sub_details.splice(i, 1)

            // decrease total currency use
            source.totalCurrency--
        },
        currencyWalletTotal(wallet) {
            if (wallet.totalCurrency < wallet.wallet_currencies.length) {
                return true
            } else {
                return false
            }
        },
        currencyExchangeTotal(exchange) {
            if (exchange.totalCurrency < exchange.exchange_currencies.length) {
                return true
            } else {
                return false
            }
        },
        currencyAccountTotal(account) {
            if (account.totalCurrency < this.fiat_currencies.length) {
                return true
            } else {
                return false
            }
        },
        getDecimal(id, currencies) {
            if (currencies[0]) {
                if (currencies[0].currency && currencies[0] !== undefined) {
                    let selectedCurrencyArray = currencies.find(x => x.currency_id == id);
                    
                    return (selectedCurrencyArray.currency.decimal_displayed) ? selectedCurrencyArray.currency.decimal_displayed : 2
                } else {
                    let selectedCurrencyArray = currencies.find(x => x.id == id);
                    return (selectedCurrencyArray.decimal_displayed) ? selectedCurrencyArray.decimal_displayed : 2
                }
            } else {
                return 2
            }
        },
        savePost() {
            this.$parent.$parent.messageModal = false
            this.form.opening_balances = []

            // check if data is empty
            if (!(this.assetWallet || this.assetExchange || this.assetBankAccount)) {
                this.$parent.$parent.messageModal = true
                this.$parent.$parent.status = 'danger'
                this.$parent.$parent.message = 'Please input a data first!'
                $('#myModal').animate({scrollTop: 0}, 500, 'swing')
                return false
            }

            // assign data to form
            this.wallets.forEach((item) => {
                if (item.form.length) {
                    this.form.opening_balances.push(item.form[0])
                }
            })

            this.exchanges.forEach((item) => {
                if (item.form.length) {
                    this.form.opening_balances.push(item.form[0])
                }
            })

            this.bankAccounts.forEach((item) => {
                if (item.form.length) {
                    this.form.opening_balances.push(item.form[0])
                }
            })

            // check data with wrong or empty value
            let dataCurrencyEmpty = 0
            let dataAmountEmpty = 0
            this.form.opening_balances.forEach((item) => {
                item.sub_details.forEach((val) => {
                    if (val.currency_id == 0) {
                        dataEmpty++
                    }
                    if (val.amount <= 0) {
                        dataAmountEmpty++
                    }
                })
            })

            if (dataCurrencyEmpty == (this.assetWallet+this.assetExchange+this.assetBankAccount)) {
                this.$parent.$parent.messageModal = true
                this.$parent.$parent.status = 'danger'
                this.$parent.$parent.message = 'Please input a data first!'
                $('#myModal').animate({scrollTop: 0}, 500, 'swing')
                return false
            }

            if (dataAmountEmpty) {
                this.$parent.$parent.messageModal = true
                this.$parent.$parent.status = 'danger'
                this.$parent.$parent.message = "Amount of the currency can't be empty or zero!"
                $('#myModal').animate({scrollTop: 0}, 500, 'swing')
                return false
            }

            // check duplicate data
            let duplicate = 0

            $.each(this.form.opening_balances, function(index, value){
                for (let i = 0; i < value.sub_details.length; i++) {
                    if (i != (value.sub_details.length-1)) {
                        if(value.sub_details[i].currency_id === value.sub_details[i+1].currency_id){
                            duplicate++
                        }
                    }
                }
            })

            if (duplicate > 0) {
                this.$parent.$parent.messageModal = true
                this.$parent.$parent.status = 'danger'
                this.$parent.$parent.message = 'There is a duplicate currency in one wallet! Pleace check your data!'
                $('#myModal').animate({scrollTop: 0}, 500, 'swing')
                return false
            }

            // Set date transaction
            let dateObj = moment(this.$parent.$parent.form.theDate)._isValid ? new Date(this.$parent.$parent.form.theDate) : new Date("1 "+this.$parent.$parent.form.theDate)
            dateObj.setDate(dateObj.getDate()+1)

            // Sent data to API
            this.axios.post('/opening-balance', {
                opening_balances: this.form.opening_balances,
                transaction_at: dateObj,
            })
            .then(response => {
                if (response.data.status == 'success') {
                    this.$parent.$parent.messageModal = true
                    this.$parent.$parent.status = response.data.status
                    this.$parent.$parent.message = response.data.message
                    this.$parent.$parent.closeModal()
                }else {
                    this.$parent.$parent.messageModal = true
                    this.$parent.$parent.status = 'danger'
                    this.$parent.$parent.message = 'Sorry, the system can not execute the command!'
                    $('#myModal').animate({scrollTop: 0}, 500, 'swing')
                }
            })
            .catch(e => {
                this.$parent.$parent.messageModal = true
                this.$parent.$parent.status = 'danger'
                this.$parent.$parent.message = 'Oops, something wrong!'
                $('#myModal').animate({scrollTop: 0}, 500, 'swing')
            })
        },
        editPost() {
            this.$parent.$parent.messageModal = false
            this.form.opening_balances = []

            // check if data is empty
            if (!(this.assetWallet || this.assetExchange || this.assetBankAccount)) {
                this.$parent.$parent.messageModal = true
                this.$parent.$parent.status = 'danger'
                this.$parent.$parent.message = 'Please input a data first!'
                $('#myModal').animate({scrollTop: 0}, 500, 'swing')
                return false
            }

            // assign data to form
            this.wallets.forEach((item) => {
                if (item.form.length) {
                    this.form.opening_balances.push(item.form[0])
                }
            })

            this.exchanges.forEach((item) => {
                if (item.form.length) {
                    this.form.opening_balances.push(item.form[0])
                }
            })

            this.bankAccounts.forEach((item) => {
                if (item.form.length) {
                    this.form.opening_balances.push(item.form[0])
                }
            })

            // check data with wrong or empty value
            let dataCurrencyEmpty = 0
            let dataAmountEmpty = 0
            this.form.opening_balances.forEach((item) => {
                item.sub_details.forEach((val) => {
                    if (val.currency_id == 0) {
                        dataEmpty++
                    }
                    if (val.amount <= 0) {
                        dataAmountEmpty++
                    }
                })
            })

            if (dataCurrencyEmpty == (this.assetWallet+this.assetExchange+this.assetBankAccount)) {
                this.$parent.$parent.messageModal = true
                this.$parent.$parent.status = 'danger'
                this.$parent.$parent.message = 'Please input a data first!'
                $('#myModal').animate({scrollTop: 0}, 500, 'swing')
                return false
            }

            if (dataAmountEmpty) {
                this.$parent.$parent.messageModal = true
                this.$parent.$parent.status = 'danger'
                this.$parent.$parent.message = "Amount of the currency can't be empty or zero!"
                $('#myModal').animate({scrollTop: 0}, 500, 'swing')
                return false
            }

            // check duplicate data
            let duplicate = 0

            $.each(this.form.opening_balances, function(index, value){
                for (let i = 0; i < value.sub_details.length; i++) {
                    if (i != (value.sub_details.length-1)) {
                        if(value.sub_details[i].currency_id === value.sub_details[i+1].currency_id){
                            duplicate++
                        }
                    }
                }
            })

            if (duplicate > 0) {
                this.$parent.$parent.messageModal = true
                this.$parent.$parent.status = 'danger'
                this.$parent.$parent.message = 'There is a duplicate currency in one wallet! Pleace check your data!'
                $('#myModal').animate({scrollTop: 0}, 500, 'swing')
                return false
            }

            // Set date transaction
            let dateObj = moment(this.$parent.$parent.form.theDate)._isValid ? new Date(this.$parent.$parent.form.theDate) : new Date("1 "+this.$parent.$parent.form.theDate)
            dateObj.setDate(dateObj.getDate()+1)

            // Sent data to API
            this.axios.put('/opening-balance/'+this.dataTransaction.transactionable_id, {
                opening_balances: this.form.opening_balances,
                transaction_at: dateObj,
            })
            .then(response => {
                if (response.data.status == 'success') {
                    this.$parent.$parent.messageModal = true
                    this.$parent.$parent.status = response.data.status
                    this.$parent.$parent.message = response.data.message
                    this.$parent.$parent.closeModal()
                }else {
                    this.$parent.$parent.messageModal = true
                    this.$parent.$parent.status = 'danger'
                    this.$parent.$parent.message = 'Sorry, the system can not execute the command!'
                    $('#myModal').animate({scrollTop: 0}, 500, 'swing')
                }
            })
            .catch(e => {
                this.$parent.$parent.messageModal = true
                this.$parent.$parent.status = 'danger'
                this.$parent.$parent.message = 'Oops, something wrong!'
                $('#myModal').animate({scrollTop: 0}, 500, 'swing')
            })
            this.$eventHub.$off('eventEditTransaction')
        },
        disabledOption(id, sub_details) {
            let option = false
            sub_details.forEach((item) => {
                if (item.currency_id == id) {
                    option = true
                }
            })
            return option
        }
    },
    directives: {
        money: VMoney
    },
    beforeDestroy() {
        this.$eventHub.$off('eventSaveTransaction')
        this.$eventHub.$off('eventEditTransaction')
    },  
}
</script>