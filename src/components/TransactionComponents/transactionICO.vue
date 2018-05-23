<template>
    <div class="transactionContainer">
        <div v-if="loader" class="centerSpinner">
            <atom-spinner :animation-duration="1000" :size="100" :color="'#fd7e14'"  />
        </div>

        <b-card no-body class="deposit" v-else>
            <form>
                <b-form-group id="inputExchangeGroup" :label-cols="2" label="Exchange*" label-for="inputExchange" horizontal :invalid-feedback="feedbackExchange" :state="stateExchange">
                    <b-row>
                        <b-col sm="5">
                            <b-form-select id="inputExchange" class="form-control" size="sm" :options="exchanges" :text-field="'name'" :value-field="'id'" v-model="form.exchangeId" :state="stateExchange">
                                <template slot="first">
                                    <option :value="null" disabled>-- Select Exchange --</option>
                                </template>
                            </b-form-select>
                        </b-col>
                    </b-row>
                </b-form-group>
                <b-form-group id="inputBoughtAmountGroup" :label-cols="2" label="Bought Amount*" label-for="inputBoughtAmount" horizontal :invalid-feedback="feedbackBoughtAmount" :state="stateBoughtAmount">
                    <b-row>
                        <b-col sm="5">
                            <b-input-group id="inputBoughtAmount" size="sm">
                                <b-form-input type="text" style="width:171px;" v-model="form.boughtAmount" :state="stateBoughtAmount" placeholder="enter amount" class="text-right pr-3"></b-form-input>
                                <b-form-select class="form-control" style="width:65px;" size="sm" :options="currencies" :text-field="'ticker_default'" :value-field="'id'" v-model="form.boughtCurrencyid"></b-form-select>
                            </b-input-group>
                        </b-col>
                        <b-col sm="6" style="padding-right:0;">
                            <b-form-group id="inputTotalValueGroup" label="Value" label-for="inputValue" horizontal :invalid-feedback="feedbackBoughtValue" :state="stateBoughtValue" style="margin-bottom:0px !important;">
                                <b-input-group size="sm">
                                    <b-input-group-text slot="append" v-bind:class="{loadinggif: loadingBought}">{{ baseCurrency.ticker_default }}/{{ selectedBoughtCurrency }}</b-input-group-text>                            
                                    <b-form-input id="inputValue"  type="text" v-model="form.boughtValue" :state="stateBoughtValue" placeholder="enter value" class="text-right pr-3"></b-form-input>
                                </b-input-group>
                            </b-form-group>
                        </b-col>
                        <b-col sm="1" style="padding-left:0;">
                            <b-button :variant="'outline-secondary'" style="width:36px !important; padding: 3px 2px 2px !important"><i class="fal fa-cloud-download" style="font-size:22px;"></i></b-button>
                        </b-col>
                    </b-row>
                </b-form-group>
                <b-form-group id="inputTransferAmountGroup" :label-cols="2" label="Transfer Amount*" label-for="inputTransferAmount" horizontal :invalid-feedback="feedbackTransferAmount" :state="stateTransferAmount">
                    <b-row>
                        <b-col sm="5">
                            <b-input-group id="inputTransferAmount" size="sm">
                                <b-form-input type="text" style="width:171px;" v-model="form.transferAmount" :state="stateTransferAmount" placeholder="enter amount" class="text-right pr-3" v-on:input="countTotal"></b-form-input>
                                <b-form-select class="form-control" style="width:65px;" size="sm" :options="fiatCurrencies" :text-field="'ticker_default'" :value-field="'id'" v-model="form.transferCurrencyid"></b-form-select>
                            </b-input-group>
                        </b-col>
                        <b-col sm="6" style="padding-right:0;">
                            <b-form-group id="inputValueGroup" label="Value" label-for="inputValue" horizontal :invalid-feedback="feedbackTransferValue" :state="stateTransferValue" style="margin-bottom:0px !important;">
                                <b-input-group size="sm">
                                    <b-input-group-text slot="append"  v-bind:class="{loadinggif: loadingTransfer}">{{ baseCurrency.ticker_default }}/{{ selectedTransferCurrency }}</b-input-group-text>                            
                                    <b-form-input id="inputValue"  type="text" v-model="form.transferValue" :state="stateTransferValue" placeholder="enter value" class="text-right pr-3"></b-form-input>
                                </b-input-group>
                            </b-form-group>
                        </b-col>
                        <b-col sm="1" style="padding-left:0;">
                            <b-button :variant="'outline-secondary'" style="width:36px !important; padding: 3px 2px 2px !important"><i class="fal fa-cloud-download" style="font-size:22px;"></i></b-button>
                        </b-col>
                    </b-row>
                </b-form-group>
                
                <b-form-group id="inputFeeGroup" :label-cols="2" label="Fee*" label-for="inputFee" horizontal :invalid-feedback="feedbackFee" :state="stateFee">
                    <b-row>
                        <b-col sm="5">                       
                            <b-input-group size="sm">
                                <b-form-select id="inputFee" style="width:57px" class="form-control" size="sm" v-model="form.fee">
                                    <option value="flat">Flat</option>
                                    <option value="percentage">%</option>
                                </b-form-select>                             
                                <b-form-input type="text" style="width:113px;" v-model="form.feeValue"  v-on:input="countTotal" :state="stateFee" placeholder="enter fee" class="text-right pr-3"></b-form-input>
                                <b-form-select :disabled="form.fee != 'flat'" class="form-control" style="width:65px;" size="sm" :options="fiatCurrencies" :text-field="'ticker_default'" :value-field="'id'" v-model="form.transferCurrencyid" ></b-form-select>
                            </b-input-group>
                        </b-col>
                    </b-row>
                    <!-- <b-row>
                        <b-col sm="5">
                            <b-form-radio-group v-model="form.fee_type" name="inputFeeRadios">
                                <b-form-radio value="additive" selected>Additive</b-form-radio>
                                <b-form-radio value="included">Included</b-form-radio>
                            </b-form-radio-group>
                        </b-col>
                    </b-row> -->
                </b-form-group>
                <b-form-group id="inputTotalGroup" :label-cols="2" label="Paid Total" label-for="inputTotal" horizontal>
                    <b-row>
                        <b-col sm="5" style="padding-top:7px;"><strong>{{ this.form.paidTotal }}</strong> {{ nameCurrency }}</b-col>
                    </b-row>
                </b-form-group>
                <b-form-group id="inputCommentGroup" :label-cols="2" label="Comment" label-for="inputComment" horizontal :invalid-feedback="feedbackComment" :state="stateComment">
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
    props: ['baseCurrencyProp','exchangesProp','accountsProp','currenciesProp','dataTransactionProps'],
    components: {
      AtomSpinner
    },    
    data(){
        return{
            loader: false,
            exchanges: [],
            currencies: [],
            accounts: [],
            errors: [],
            baseCurrency: [],
            selectedBoughtCurrency: null,
            selectedTransferCurrency: null,
            loadingBought: false,
            loadingTransfer: false,
            dataTransaction: this.dataTransactionProps,
            standart: {
                bought: false,
                transfer: false
            },
            form: {
                exchangeId: null,
                accountId: null,
                currencyid: null,
                boughtCurrencyid: null,
                transferCurrencyid: null,
                boughtAmount: null,
                transferAmount: null,
                boughtValue: 1,
                transferValue: 1,
                paidTotal: 0,
                fee: 'flat',
                fee_type: 'included',
                feeValue: null,
                comment: null
            }
        }
    },
    created(){
        this.$parent.$parent.messageModal = false
        this.exchanges = this.exchangesProp
        this.accounts = this.accountsProp
        this.currencies = this.currenciesProp.filter(function(x){ return x.classification == 'digital'; })
        this.fiatCurrencies = this.currenciesProp.filter(function(x){ return x.classification == 'fiat'; })
        this.baseCurrency = this.baseCurrencyProp

        //Listen to save event from any component .ex from parent
        this.$eventHub.$on('eventSaveTransaction', this.savePost)
        this.$eventHub.$on('eventEditTransaction', this.editPost)
    },
    mounted(){
        this.form.transferCurrencyid = this.baseCurrency.id
        this.selectedTransferCurrency = this.baseCurrency.ticker_default

        // assign data when update
        if (this.dataTransaction) {
            this.form.exchangeId = this.dataTransaction.transactionable.exchange_id
            this.form.boughtAmount = this.dataTransaction.transactionable.buy_amount
            this.form.boughtCurrencyid = this.dataTransaction.transactionable.buy_currency_id
            this.form.boughtValue = this.dataTransaction.transactionable.buy_in_base
            this.form.transferAmount = this.dataTransaction.transactionable.transfer_amount
            this.form.transferValue = this.dataTransaction.transactionable.transfer_in_base
            this.form.transferCurrencyid = this.dataTransaction.transactionable.transfer_currency_id
            this.form.fee = this.dataTransaction.transactionable.fee
            this.form.feeValue = this.dataTransaction.transactionable.fee_amount
            this.form.fee_type = this.dataTransaction.transactionable.fee_type
            this.form.comment = this.dataTransaction.transactionable.comment
            this.standart.bought = true
            this.standart.bought = true
        }
    },
    watch: {
    	'form.fee': function (val) {
    		this.countTotal()
        },
        'form.transferCurrencyid': function (val){
            var self = this
            var selectedCurrencyArray = this.fiatCurrencies.filter(function(x){ return x.id == self.form.transferCurrencyid; })
            this.selectedTransferCurrency = selectedCurrencyArray[0].ticker_default

            if (this.standart.transfer == false) {
                this.loadingTransfer = true
                var url = "https://min-api.cryptocompare.com/data/price?fsym="+this.selectedTransferCurrency+"&tsyms="+this.baseCurrency.name+""
                var transferCompare = this.axios.create({
                    baseURL: url,
                    timeout: 3000,
                });
                transferCompare.get()
                .then(response => {
                    self.form.transferValue = response.data[this.baseCurrency.name]
                    self.loadingTransfer = false
                }).catch(error => {
                    console.log(error)
                    self.loadingTransfer = false
                })

                this.countTotal()
            }else {
                this.standart.transfer = false
            }
            
        },
        'form.boughtCurrencyid': function (val){
            var self = this
            var selectedCurrencyArray = this.currencies.filter(function(x){ return x.id == self.form.boughtCurrencyid; });
            this.selectedBoughtCurrency = selectedCurrencyArray[0].ticker_default;

            if (this.standart.bought == false) {
                this.loadingBought = true
                var self = this
                var url = "https://min-api.cryptocompare.com/data/price?fsym="+this.selectedBoughtCurrency+"&tsyms="+this.baseCurrency.name+""
                var boughtCompare = this.axios.create({
                    baseURL: url,
                    timeout: 3000,
                });
                boughtCompare.get()
                .then(response => {
                    self.form.boughtValue = response.data[this.baseCurrency.name]
                    self.loadingBought = false
                }).catch(error => {
                    console.log(error)
                    self.loadingBought = false
                })
            }else {
                this.standart.bought = false
            }
            
        }
    },
	computed: {
		stateFee() {
			return this.errors.fee_amount  ? false : 'normal'
		},
		feedbackFee() {
			return this.errors.fee_amount ? this.errors.fee_amount[0] : ''
        },
        stateComment() {
			return this.errors.comment  ? false : 'normal'
		},
		feedbackComment() {
			return this.errors.comment ? this.errors.amount[0] : ''
        },        
		stateBoughtAmount() {
			return this.errors.amount  ? false : 'normal'
		},
		feedbackBoughtAmount() {
			return this.errors.amount ? this.errors.amount[0] : ''
        },
        stateTransferAmount() {
			return this.errors.amount  ? false : 'normal'
		},
		feedbackTransferAmount() {
			return this.errors.amount ? this.errors.amount[0] : ''
        },
		stateTransferValue() {
			return this.errors.amount_in_base  ? false : 'normal'
		},
		feedbackTransferValue() {
			return this.errors.amount_in_base ? this.errors.amount_in_base[0] : ''
        },
        stateBoughtValue() {
			return this.errors.amount_in_base  ? false : 'normal'
		},
		feedbackBoughtValue() {
			return this.errors.amount_in_base ? this.errors.amount_in_base[0] : ''
        },         
		stateExchange() {
			return this.errors.exchange_id  ? false : 'normal'
		},
		feedbackExchange() {
			return this.errors.exchange_id ? this.errors.exchange_id[0] : ''
        },
		stateAccount() {
			return this.errors.account_id  ? false : 'normal'
		},
		feedbackAccount() {
			return this.errors.account_id ? this.errors.account_id[0] : ''
		},
        nameCurrency: function () {
            let currency = this.form.transferCurrencyid
            let ticker = this.fiatCurrencies.filter(function(x){ return x.id == currency })
            if (ticker.length) {
                return ticker[0].ticker_default
            }
        },

    },
    methods: {
        countTotal(){
            if(this.form.fee == "flat") {
                this.form.paidTotal = parseInt(this.form.transferAmount) - parseInt(this.form.feeValue)
            }else if(this.form.fee == "percentage"){
                this.form.paidTotal = parseInt(this.form.transferAmount) - (parseInt(this.form.transferAmount) * (parseInt(this.form.feeValue)/100))
            }else {
                this.form.paidTotal = 0
            }

            if((typeof this.form.paidTotal === 'undefined') || (typeof this.form.paidTotal === 'NaN') || (isNaN(this.form.paidTotal))){
                this.form.paidTotal = 0
            }
        },
        savePost(){
            this.$parent.$parent.messageModal = false

            if (!(this.form.exchangeId && this.form.boughtAmount && this.form.transferAmount && this.form.feeValue && this.form.boughtCurrencyid)) {
                this.$parent.$parent.messageModal = true
                this.$parent.$parent.status = 'danger'
                this.$parent.$parent.message = 'Please fill all the requiered field!'
                $('#myModal').animate({scrollTop: 0}, 500, 'swing')
                return false
            }

            var dateObj = new Date(this.$parent.$parent.form.theDate)
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
            var dateObj = new Date(this.$parent.$parent.form.theDate)
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