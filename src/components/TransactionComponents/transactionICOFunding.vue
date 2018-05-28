<template>
    <div class="transactionContainer">
        <div v-if="loader" class="centerSpinner">
            <atom-spinner :animation-duration="1000" :size="100" :color="'#fd7e14'"  />
        </div>

        <b-card no-body class="deposit" v-else>
            <form>
                <b-form-group id="inputExchangeGroup" :label-cols="2" label="ICO Coin*" label-for="inputExchange" horizontal>
                    <b-row>
                        <b-col sm="5">
                            <b-form-select id="inputExchange" class="form-control" size="sm" :options="currencies" :text-field="'name'" :value-field="'id'" v-model="form.ico_currency_id">
                                <template slot="first">
                                    <option :value="null" disabled>-- Select ICO Coin --</option>
                                </template>
                            </b-form-select>
                        </b-col>
                    </b-row>
                </b-form-group>
                <b-form-group id="inputExchangeGroup" :label-cols="2" label="Funding Name*" label-for="inputExchange" horizontal>
                    <b-row>
                        <b-col sm="5">
                            <b-form-input id="inputValue"  type="text" v-model="form.fund_name" placeholder="Enter name"></b-form-input>
                        </b-col>
                    </b-row>
                </b-form-group>
                <b-form-group id="inputBoughtAmountGroup" :label-cols="2" label="Fund Amount*" label-for="inputBoughtAmount" horizontal>
                    <b-row>
                        <b-col sm="5">
                            <b-input-group id="inputBoughtAmount" size="sm">
                                <b-form-input type="text" style="width:171px;" v-model="form.fund_amount" placeholder="enter amount" class="text-right pr-3"></b-form-input>
                                <b-form-select class="form-control" style="width:65px;" size="sm" :options="currencies" :text-field="'ticker_default'" :value-field="'id'" v-model="form.fund_currency_id"></b-form-select>
                            </b-input-group>
                        </b-col>
                        <b-col sm="6" style="padding-right:0;">
                            <b-form-group id="inputTotalValueGroup" label="Value" label-for="inputValue" horizontal style="margin-bottom:0px !important;">
                                <b-input-group size="sm">
                                    <b-input-group-text slot="append" v-bind:class="{loadinggif: loaderCurrency}">{{ baseCurrency.ticker_default }}/{{ selectedCurrency }}</b-input-group-text>                            
                                    <b-form-input id="inputValue"  type="text" v-model="form.fund_value" placeholder="enter value" class="text-right pr-3"></b-form-input>
                                </b-input-group>
                            </b-form-group>
                        </b-col>
                        <b-col sm="1" style="padding-left:0;">
                            <b-button :variant="'outline-secondary'" style="width:36px !important; padding: 3px 2px 2px !important"><i class="fal fa-cloud-download" style="font-size:22px;"></i></b-button>
                        </b-col>
                    </b-row>
                </b-form-group>
                <b-form-group id="inputExchangeGroup" v-show="form.fund_currency_id" :label-cols="2" label="Taken From*" label-for="inputExchange" horizontal>
                    <b-row>
                        <b-col sm="5">
                             <b-form-select id="inputExchange" class="form-control" size="sm" v-model="form.from_account_id" required >
                                    <option :value="null" disabled>-- Select Wallet/Account --</option>
                                    <option v-for="wallet in wallets" v-show="walletSelection" :value="'wallet_'+wallet.id">{{ wallet.name }}</option>
                                    <option v-for="account in accounts" v-show="accountSelection" :value="'account_'+account.id">{{ account.bank_name }}</option>
                                </b-form-select>
                        </b-col>
                    </b-row>
                </b-form-group>
                <b-form-group id="inputExchangeGroup" v-show="hasAddress" :label-cols="2" label="address*" label-for="inputExchange" horizontal>
                    <b-row>
                        <b-col sm="5">
                            <b-form-input id="inputValue"  type="text" v-model="form.address" placeholder="Enter address"></b-form-input>
                        </b-col>
                    </b-row>
                </b-form-group>
                <b-form-group id="inputCommentGroup" :label-cols="2" label="Comment" label-for="inputComment" horizontal>
                    <b-row>
                        <b-col sm="5">
                            <b-form-textarea id="inputComment" v-model="form.comment" placeholder="Enter comments" :rows="6"></b-form-textarea>
                        </b-col>
                    </b-row>
                </b-form-group>
                <p>* Required field</p>
            </form>
        </b-card>
    </div>
</template>

<script>
import {AtomSpinner} from 'epic-spinners'
import Vue from 'vue'

export default {
    props: ['baseCurrencyProp','accountsProp','dataTransactionProps'],
    components: {
      AtomSpinner
    },    
    data(){
        return{
            loader: false,
            loaderCurrency: false,
            hasAddress: false,
            walletSelection: false,
            accountSelection: false,
            currencies: [],
            accounts: this.accountsProp,
            wallets: [],
            digital_currencies: [],
            fiat_currencies: [],
            // address: [],
            errors: [],
            baseCurrency: this.baseCurrencyProp,
            dataTransaction: this.dataTransactionProps,
            form: {
                ico_currency_id: null,
                fund_name: null,
                fund_amount: null,
                fund_currency_id: null,
                fund_value: null,
                from_account_id: null,
                address: null,
                comment: null,
            }
        }
    },
    created(){
        this.$parent.$parent.messageModal = false
        // get data digital currency only
        this.axios.get('/currency/show/supportive-storage')
            .then(response => {
             this.currencies = response.data.data
            }).catch(error => {
             console.log(error)
            })

        this.axios.get('/currency/show/filter?classification=ico')
            .then(response => {
                // this.currencies = response.data.data
                console.log(response.data.data)
            }).catch(error => {
                console.log(error)
            })

        //Listen to save event from any component .ex from parent
        this.$eventHub.$on('eventSaveTransaction', this.savePost)
        this.$eventHub.$on('eventEditTransaction', this.editPost)
    },
    mounted(){
        // assign data when update
        if (this.dataTransaction) {
            console.log('Hello!')
            // this.form.ico_currency_id = this.dataTransaction.transactionable.ico_currency_id
            // this.form.fund_name = this.dataTransaction.transactionable.fund_name
            // this.form.fund_amount = this.dataTransaction.transactionable.fund_amount
            // this.form.fund_currency_id = this.dataTransaction.transactionable.fund_currency_id
            // this.form.fund_value = this.dataTransaction.transactionable.fund_value
            // this.form.from_account_id = this.dataTransaction.transactionable.from_account_id
            // this.form.comment = this.dataTransaction.transactionable.comment
        }
    },
    watch: {
        'form.from_account_id': function(val) {
            if (val) {
                let type = val.split('_')
                type[0] == 'wallet' ? this.hasAddress = true : this.hasAddress = false
                if (type[0] == 'wallet') {
                    this.hasAddress = true
                    let selectedWallet = this.wallets.find(x => x.id == type[1])

                    // this.address = []
                    this.form.address = selectedWallet.addresses[0].address
                    // this.address.push(selectedAddress.address)
                }else{
                    this.hasAddress = false
                }
            }
        },
        'form.fund_currency_id': function(val) {
            this.loaderCurrency = true
            let currencySelection = this.currencies.find(x => x.id == val)
            let apiDataCurrency = 'https://min-api.cryptocompare.com/data/dayAvg?fsym=' + currencySelection.ticker_default + '&tsym=' + this.baseCurrency.ticker_default + '&toTs=' + moment(new Date(), "DD MMMM YYYY").unix()

            let apiCurrency = this.axios.create({
                baseURL: apiDataCurrency,
                timeout: 3000,
            });
            apiCurrency.get()
                .then(response => {
                    this.loaderCurrency = false
                    this.form.fund_value = response.data[this.baseCurrency.ticker_default]
                }).catch(error => {
                    console.log("Error getting data from API")
                })
            if (currencySelection.classification == 'digital') {
                this.walletSelection = true
                this.accountSelection = false
                this.hasAddress = false
                this.form.from_account_id = null
                this.wallets = currencySelection.supportive_wallets
            } else {
                this.walletSelection = false
                this.accountSelection = true
                this.hasAddress = false
            }
        },
    },
	computed: {
        selectedCurrency: function(){
            let currencySelection = this.currencies.find(x => x.id == this.form.fund_currency_id)
            return currencySelection ? currencySelection.ticker_default : ''
        },
    },
    methods: {
        savePost(){
            this.$parent.$parent.messageModal = false

            if (!(this.form.exchangeId && this.form.boughtAmount && this.form.transferAmount && this.form.feeValue && this.form.boughtCurrencyid)) {
                this.$parent.$parent.messageModal = true
                this.$parent.$parent.status = 'danger'
                this.$parent.$parent.message = 'Please fill all the requiered field!'
                $('#myModal').animate({scrollTop: 0}, 500, 'swing')
                return false
            }

            let dateObj = new Date(this.$parent.$parent.form.theDate)
            dateObj.setDate(dateObj.getDate()+1)

			this.axios.post('/bought', {
                exchange_id: this.form.exchangeId,
                transaction_at: dateObj,
                buy_amount: this.form.boughtAmount,
                buy_currency_id: this.form.boughtCurrencyid,
                buy_in_base: this.form.boughtValue,
                transfer_amount: this.form.transferAmount,
                transfer_in_base: this.form.transferValue,
                transfer_currency_id: this.form.transferCurrencyid,
                fee: this.form.fee,
                fee_amount: this.form.feeValue,
                fee_type: this.form.fee_type,
                comment: this.form.comment
			}).then(response => {
				if (response.data.status == 'success') {
					this.$parent.$parent.messageModal = true
                    this.$parent.$parent.status = response.data.status
                    this.$parent.$parent.message = response.data.message
                    this.form.opening_balances = []
                    this.$parent.$parent.closeModal()
				}else {
					this.$parent.$parent.messageModal = true
                    this.$parent.$parent.status = 'danger'
                    this.$parent.$parent.message = 'Sorry, the system can not execute the command'
                    $('#myModal').animate({scrollTop: 0}, 500, 'swing')
				}
			})
			.catch(e => {
                this.$parent.$parent.messageModal = true
                this.$parent.$parent.status = 'danger'
                this.$parent.$parent.message = e.response.data.message
                $('#myModal').animate({scrollTop: 0}, 500, 'swing')
    		})
        },
        editPost() {
            this.$parent.$parent.messageModal = false

            if (!(this.form.exchangeId && this.form.boughtAmount && this.form.transferAmount && this.form.feeValue && this.form.boughtCurrencyid)) {
                this.$parent.$parent.messageModal = true
                this.$parent.$parent.status = 'danger'
                this.$parent.$parent.message = 'Please fill all the requiered field!'
                $('#myModal').animate({scrollTop: 0}, 500, 'swing')
                return false
            }

            // sent data to API
            let dateObj = new Date(this.$parent.$parent.form.theDate)
            dateObj.setDate(dateObj.getDate()+1)

            this.axios.put('/bought/'+this.dataTransaction.transactionable.id, {
                exchange_id: this.form.exchangeId,
                transaction_at: dateObj,
                buy_amount: this.form.boughtAmount,
                buy_currency_id: this.form.boughtCurrencyid,
                buy_in_base: this.form.boughtValue,
                transfer_amount: this.form.transferAmount,
                transfer_in_base: this.form.transferValue,
                transfer_currency_id: this.form.transferCurrencyid,
                fee: this.form.fee,
                fee_amount: this.form.feeValue,
                fee_type: this.form.fee_type,
                comment: this.form.comment
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
        }
    },
    beforeDestroy() {
        this.$eventHub.$off('eventSaveTransactionDone')
        this.$eventHub.$off('eventEditTransaction')
    }, 
}
</script>

<style>
.card.deposit{
    padding:15px;
    padding-right:10px;
}
#inputValueGroup label{
    padding-right:20px;
}
.inputGroupBtn button{
    margin-left:0px !important;
    padding:2px 8px !important
}
.deposit .dropdown-item{
    font-size: 14px;
    padding: 5px 15px;
}

.loadinggif 
{
   background:
     url('http://www.hsi.com.hk/HSI-Net/pages/images/en/share/ajax-loader.gif')
     no-repeat
     right center;
}
</style>