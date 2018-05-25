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
                                    <b-input-group-text slot="append" v-bind:class="{loadinggif: loadingBought}">{{ baseCurrency.ticker_default }}/{{ selectedBoughtCurrency }}</b-input-group-text>                            
                                    <b-form-input id="inputValue"  type="text" v-model="form.fund_value" placeholder="enter value" class="text-right pr-3"></b-form-input>
                                </b-input-group>
                            </b-form-group>
                        </b-col>
                        <b-col sm="1" style="padding-left:0;">
                            <b-button :variant="'outline-secondary'" style="width:36px !important; padding: 3px 2px 2px !important"><i class="fal fa-cloud-download" style="font-size:22px;"></i></b-button>
                        </b-col>
                    </b-row>
                </b-form-group>
                <b-form-group id="inputExchangeGroup" :label-cols="2" label="Wallet/Account*" label-for="inputExchange" horizontal>
                    <b-row>
                        <b-col sm="5">
                            <b-form-select id="inputExchange" class="form-control" size="sm" :options="currencies" :text-field="'name'" :value-field="'id'" v-model="form.from_account_id">
                                <template slot="first">
                                    <option :value="null" disabled>-- Select Wallet/Account --</option>
                                </template>
                            </b-form-select>
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
    props: ['baseCurrencyProp','accountsProp','currenciesProp','dataTransactionProps'],
    components: {
      AtomSpinner
    },    
    data(){
        return{
            loader: false,
            currencies: this.currenciesProp,
            accounts: this.accountsProp,
            errors: [],
            baseCurrency: this.baseCurrencyProp,
            dataTransaction: this.dataTransactionProps,
            form: {
                ico_currency_id: null,
                fund_amount: null,
                fund_currency_id: null,
                fund_value: null,
                from_account_id: null,
                comment: null
            }
        }
    },
    created(){
        this.$parent.$parent.messageModal = false

        //Listen to save event from any component .ex from parent
        this.$eventHub.$on('eventSaveTransaction', this.savePost)
        this.$eventHub.$on('eventEditTransaction', this.editPost)
    },
    mounted(){
        // assign data when update
        if (this.dataTransaction) {
            this.form.ico_currency_id = this.dataTransaction.transactionable.ico_currency_id
            this.form.fund_amount = this.dataTransaction.transactionable.fund_amount
            this.form.fund_currency_id = this.dataTransaction.transactionable.fund_currency_id
            this.form.fund_value = this.dataTransaction.transactionable.fund_value
            this.form.from_account_id = this.dataTransaction.transactionable.from_account_id
            this.form.comment = this.dataTransaction.transactionable.comment
        }
    },
    watch: {

    },
	computed: {

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