<template>
    <div class="transactionContainer">

        <div v-if="loader" class="centerSpinner">
            <atom-spinner :animation-duration="1000" :size="100" :color="'#fd7e14'"  />
        </div>

        <b-card no-body class="deposit" v-else>
            <form>
                <b-form-group id="inputSourceGroup" :label-cols="2" label="Taken From*" label-for="inputSource" horizontal :invalid-feedback="feedbackSource" :state="stateSource">
                    <b-row>
                        <b-col sm="5">
                            <b-form-select id="inputSource" class="form-control" size="sm" v-model="form.sourceId" :state="stateSource" @change="changeSource">
                                <template slot="first">
                                    <option :value="null" disabled>-- Select Source --</option>
                                </template>
                                <optgroup label="Bank Account" v-if="accounts.length > 0">
                                    <option v-for="(acc) in accounts" :key='acc.id' :value='"account_"+acc.id'>{{ acc.bank_name }}</option>
                                </optgroup>
                                <optgroup label="Wallet" v-if="wallets.length > 0">
                                    <option v-for="(wal) in wallets" :key='wal.id' :value='"wallet_"+wal.id'>{{ wal.name }}</option>
                                </optgroup>                            
                            </b-form-select>
                        </b-col>
                    </b-row>
                </b-form-group>
                <b-form-group id="inputAmountGroup" :label-cols="2" label="Withdraw Amt.*" label-for="inputAmount" horizontal :invalid-feedback="feedbackAmount" :state="stateAmount">
                    <b-row>
                        <b-col sm="5">
                            <b-input-group id="inputAmount" size="sm">
                                <b-form-input type="text" style="width:171px;" v-model="form.withdrawAmount" :state="stateAmount" placeholder="enter amount" class="text-right pr-3"></b-form-input>
                                <b-form-select ref="withdrawCurrencies" class="form-control" style="width:65px;" size="sm" :options="withdrawCurrencies" :text-field="'ticker_default'" :value-field="'id'" v-model="form.withdrawCurrencyId" @change="changeWithdrawCurrency" :disabled='withdrawCurrCondition'></b-form-select>
                            </b-input-group>
                        </b-col>
                        <b-col sm="6" style="padding-right:0;">
                            <b-form-group id="inputValueGroup" label="Price" label-for="inputValue" horizontal :invalid-feedback="feedbackValue" :state="stateValue" style="margin-bottom:0px !important;">
                                <b-input-group size="sm">
                                    <b-input-group-text slot="append">{{ baseCurrency.ticker_default }}/{{ selectedWithdrawCurrency }}</b-input-group-text>                            
                                    <b-form-input id="inputValue"  type="text" v-model="form.withdrawValue" :state="stateValue" placeholder="enter value" class="text-right pr-3"></b-form-input>
                                </b-input-group>
                            </b-form-group>
                        </b-col>
                        <b-col sm="1" style="padding-left:0;">
                            <b-button :variant="'outline-secondary'" style="width:36px !important; padding: 3px 2px 2px !important"><i :class="[ withdrawIsLoading ? 'fal fa-spinner fa-spin' : 'fal fa-cloud-download' ]" style="font-size:22px;"></i></b-button>
                        </b-col>
                    </b-row>
                </b-form-group>
                <hr style="margin-top:5px; margin-bottom:8px; border-top:1px solid #DFDFDF;">
                <b-form-group id="inputExchangeGroup" :label-cols="2" label="To Exchange*" label-for="inputExchange" horizontal :invalid-feedback="feedbackExchange" :state="stateExchange">
                    <b-row>
                        <b-col sm="5">
                            <b-form-select id="inputExchange" class="form-control" size="sm" :options="exchanges" :text-field="'name'" :value-field="'id'" v-model="form.exchangeId" :state="stateExchange" @change="changeExchange">
                                <template slot="first">
                                    <option :value="null" disabled>-- Select Exchange --</option>
                                </template>
                            </b-form-select>
                        </b-col>
                    </b-row>
                </b-form-group>
                <b-form-group id="inputAmountGroup" :label-cols="2" label="Deposit Amt.*" label-for="inputAmount" horizontal :invalid-feedback="feedbackAmount" :state="stateAmount">
                    <b-row>
                        <b-col sm="5">
                            <b-input-group id="inputAmount" size="sm">
                                <b-form-input type="text" style="width:171px;" v-model="form.depositAmount" :state="stateAmount" placeholder="enter amount" class="text-right pr-3"></b-form-input>
                                <b-form-select class="form-control" style="width:65px;" size="sm" :options="depositCurrencies" :text-field="'ticker_default'" :value-field="'id'" v-model="form.depositCurrencyId" @change="changeDepositCurrency" :disabled="form.exchangeId==null"></b-form-select>
                            </b-input-group>
                        </b-col>
                        <b-col sm="6" style="padding-right:0;">
                            <b-form-group id="inputValueGroup" label="Price" label-for="inputValue" horizontal :invalid-feedback="feedbackValue" :state="stateValue" style="margin-bottom:0px !important;">
                                <b-input-group size="sm">
                                    <b-input-group-text slot="append">{{ baseCurrency.ticker_default }}/{{ selectedDepositCurrency }}</b-input-group-text>
                                    <b-form-input id="inputValue"  type="text" v-model="form.depositValue" :state="stateValue" placeholder="enter value" class="text-right pr-3"></b-form-input>
                                </b-input-group>
                            </b-form-group>
                        </b-col>
                        <b-col sm="1" style="padding-left:0;">
                            <b-button :variant="'outline-secondary'" style="width:36px !important; padding: 3px 2px 2px !important"><i :class="[ transferIsLoading ? 'fal fa-spinner fa-spin' : 'fal fa-cloud-download' ]" style="font-size:22px;"></i></b-button>
                        </b-col>
                    </b-row>
                </b-form-group>
                <b-form-group id="inputFeeGroup" :label-cols="2" label="Fee*" label-for="inputFee" horizontal :invalid-feedback="feedbackFee" :state="stateFee">
                    <b-row>
                        <b-col sm="5">                       
                            <b-input-group size="sm">
                                <b-form-select id="inputFee" style="width:57px" class="form-control" size="sm" v-model="form.fee" @change="changeFee">
                                    <option value="flat">Flat</option>
                                    <option value="percentage">%</option>
                                </b-form-select>                             
                                <b-form-input type="text" ref="feeAmount" :style="{ width: theWidth + 'px' }" v-model="form.fee_amount" :state="stateFee" placeholder="enter fee" class="text-right pr-3"></b-form-input>
                                <b-input-group-text class="form-control" style="width:65px;" size="sm" v-if="form.fee == 'flat'">{{ selectedDepositCurrency }}</b-input-group-text>
                            </b-input-group>
                        </b-col>
                    </b-row>
                    <!--
                    <b-row>
                        <b-col sm="5">
                            <b-form-radio-group v-model="form.fee_type" name="inputFeeRadios">
                                <b-form-radio value="additive" selected>Additive</b-form-radio>
                                <b-form-radio value="included">Included</b-form-radio>
                            </b-form-radio-group>
                        </b-col>
                    </b-row>
                    -->
                </b-form-group>
                <b-form-group id="inputTotalGroup" :label-cols="2" label="Total Deposit" label-for="inputTotal" horizontal>
                    <b-row>
                        <!--<b-col sm="5" style="padding-top:7px;" v-if="totalDeposit >= 1"><strong>{{ totalDeposit }}</strong> {{ selectedDepositCurrency }}</b-col>-->
                        <b-col sm="5" style="padding-top:7px;"><strong>{{ totalDepositFunc }}</strong> {{ selectedDepositCurrency }}</b-col>
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

export default {
    props: {
        baseCurrencyProp :{default: null},
        dataTransactionProps :{default: null},
        openingBalanceProp :{default: null},
        exchangesProp :{default: null},
        currenciesProp :{default: null},
        accountsProp :{default: null},
        walletsProp :{default: null},
    },
    components: {
      AtomSpinner
    },    
    data(){
        return{
            loader: false,
            withdrawIsLoading: false,
            transferIsLoading: false,
            exchanges: [],
            depositCurrencies: [],
            withdrawCurrencies: [],
            wallets: [],
            accounts: [],
            errors: [],
            baseCurrency: [],
            openingBalanceTx: [],
            dataTransaction: [],
            selectedWithdrawCurrency: null,
            selectedDepositCurrency: null,
            withdrawCurrCondition: true,
            theWidth: 113,
            totalDeposit: 0,
            form: {
                sourceId: null,
                withdrawAmount: null,
                withdrawCurrencyId: null,
                withdrawValue: 1,
                exchangeId: null,
                depositAmount: null,
                depositCurrencyId: null,
                depositValue: 1,
                fee: 'flat',
                fee_amount: 0,
                fee_type: 'included',
                comment: null,
                txDate: null
            },
        }
    },
    created(){
        this.exchanges = this.exchangesProp.filter(function(x){ return x.exchange_currencies.length > 0})
        this.withdrawCurrencies = this.currenciesProp
        this.depositCurrencies = this.currenciesProp
        this.baseCurrency = this.baseCurrencyProp
        this.openingBalanceTx = this.openingBalanceProp.details
        this.dataTransaction = this.dataTransactionProps

        //Use all wallets
        //this.wallets = this.walletsProp

        //Use wallets that are not empty
        let walletBalance = this.openingBalanceTx.filter(function(x){ return x.balanceable_type.indexOf('Wallet') >= 0; });
        walletBalance.forEach((wallet) => {
            this.wallets.push({"id":wallet.container.id,"name":wallet.container.name})
        })

        //Use all Bank account
        //this.accounts = this.accountsProp

        //Use Bank account that are not empty
        let accountBalance = this.openingBalanceTx.filter(function(x){ return x.balanceable_type.indexOf('Account') >= 0; });
        accountBalance.forEach((account) => {
            this.accounts.push({"id":account.container.id,"bank_name":account.container.bank_name})
        })

        //event off first


        //Listen to event emitted from any component .ex from parent
        this.$eventHub.$on('eventSaveTransaction', this.savePost);
        this.$eventHub.$on('eventEditTransaction', this.editPost);
    },
    mounted(){
        if(this.dataTransaction){
            
            let sourceName;
            if(this.dataTransaction.transactionable.fromable_type.indexOf('Account') >= 0){
                sourceName = "account_";
            }else if(this.dataTransaction.transactionable.fromable_type.indexOf('Wallet') >= 0){
                sourceName = "wallet_";
            }

            this.form.txDate = this.$parent.$parent.form.theDate
            this.form.sourceId = sourceName+this.dataTransaction.transactionable.fromable_id
            this.form.withdrawAmount = this.dataTransaction.transactionable.withdraw_amount
            this.form.withdrawCurrencyId = this.dataTransaction.transactionable.withdraw_currency_id
            this.form.withdrawValue = this.dataTransaction.transactionable.withdraw_in_base
            this.form.exchangeId = this.dataTransaction.transactionable.to_exchange_id
            this.form.depositAmount = this.dataTransaction.transactionable.deposit_amount
            this.form.depositCurrencyId = this.dataTransaction.transactionable.deposit_currency_id
            this.form.depositValue = this.dataTransaction.transactionable.deposit_in_base
            this.form.fee = this.dataTransaction.transactionable.fee
            this.form.fee_amount = this.dataTransaction.transactionable.fee_amount
            this.form.fee_type = this.dataTransaction.transactionable.fee_type
            this.form.comment = this.dataTransaction.transactionable.comment
            this.selectedWithdrawCurrency = this.dataTransaction.transactionable.withdraw_currency.ticker_default 
            this.selectedDepositCurrency = this.dataTransaction.transactionable.deposit_currency.ticker_default
            this.totalDeposit = this.dataTransaction.transactionable.total
            this.changeExchange(this.dataTransaction.transactionable.to_exchange_id)
        }else{
            this.form.withdrawCurrencyId = this.baseCurrency.id
            this.form.depositCurrencyId = this.baseCurrency.id
            this.selectedWithdrawCurrency = this.baseCurrency.ticker_default
            this.selectedDepositCurrency = this.baseCurrency.ticker_default
            this.form.txDate = this.$parent.$parent.form.theDate
        }

    },
	computed: {
		stateSource() {
			//return this.errors.fee_amount  ? false : 'normal'
		},
		feedbackSource() {
			//return this.errors.fee_amount ? this.errors.fee_amount[0] : ''
        },        
		stateAmount() {
			return this.errors.amount  ? false : 'normal'
		},
		feedbackAmount() {
			return this.errors.amount ? this.errors.amount[0] : ''
        },
		stateValue() {
			return this.errors.amount_in_base  ? false : 'normal'
		},
		feedbackValue() {
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
		stateComment() {
			return this.errors.comment  ? false : 'normal'
		},
		feedbackComment() {
			return this.errors.comment ? this.errors.comment[0] : ''
        },
		stateFee() {
			//return this.errors.comment  ? false : 'normal'
		},
		feedbackFee() {
			//return this.errors.comment ? this.errors.comment[0] : ''
        },
        totalDepositFunc(){
            let substractNum = 0
            if(this.form.fee == 'percentage'){
                substractNum = Number(this.form.depositAmount) * (this.form.fee_amount/100);
            }else if(this.form.fee == 'flat'){
                substractNum = Number(this.form.fee_amount);
            }
            return this.totalDeposit =  Number(this.form.depositAmount) - substractNum
        }
    },
    watch: {
        selectedWithdrawCurrency: function(){
            this.withdrawIsLoading = true;

            if(this.selectedWithdrawCurrency!=this.baseCurrency.ticker_default){
                let txDateUnix = moment(this.form.txDate, "DD MMMM YYYY").unix()
                let url = 'https://min-api.cryptocompare.com/data/dayAvg?fsym='+ this.selectedWithdrawCurrency + '&tsym=' + this.baseCurrency.ticker_default + '&toTs=' + txDateUnix
                this.withdrawIsLoading = this.selectedCurrency('withdrawValue', url)
            }else{
                this.form.withdrawValue = 1;
                this.withdrawIsLoading = false;
            }
        },
        selectedDepositCurrency: function(){
            this.transferIsLoading = true;

            if(this.selectedDepositCurrency!=this.baseCurrency.ticker_default){
                let txDateUnix = moment(this.form.txDate, "DD MMMM YYYY").unix()
                let url = 'https://min-api.cryptocompare.com/data/dayAvg?fsym='+ this.selectedDepositCurrency + '&tsym=' + this.baseCurrency.ticker_default + '&toTs=' + txDateUnix
                this.transferIsLoading = this.selectedCurrency('depositValue', url)
            }else{
                this.form.depositValue = 1;
                this.transferIsLoading = false;
            }
        }
    },
    methods: {
        changeSource(value){
            let theValue = value.split("_")
            switch(theValue[0]){
                case "wallet" :
                    let walletBalance = this.openingBalanceTx.filter(function(x) { return x.balanceable_type.indexOf('Wallet') >= 0 });
                    console.log(walletBalance)
                    let walletIdBalance = walletBalance.find(x => x.balanceable_id == theValue[1] );
                    this.withdrawCurrencies = walletIdBalance.sub_details
                    this.form.withdrawCurrencyId = walletIdBalance.sub_details[0].id
                    this.selectedWithdrawCurrency = walletIdBalance.sub_details[0].ticker_default
                    this.withdrawCurrCondition = false
                    break;
                case "account" :
                    this.withdrawCurrencies = this.currenciesProp.filter(function(x){ return x.classification == 'fiat'; })
                    this.form.withdrawCurrencyId = this.withdrawCurrencies[0].id
                    this.selectedWithdrawCurrency = this.withdrawCurrencies[0].ticker_default                    
                    this.withdrawCurrCondition = false
                    break;
                default :
                    console.log(value)
            }
        },
        changeExchange(value){
            this.depositCurrencies = []
            let selectedExchange = this.exchanges.find(x => x.id == value);
            console.log(selectedExchange.exchange_currencies)
            selectedExchange.exchange_currencies.forEach((item) => {
                this.depositCurrencies.push(item.currency)
            })
            this.form.depositCurrencyId = this.depositCurrencies[0].id
            this.changeDepositCurrency(this.depositCurrencies[0].id)
        },
        changeWithdrawCurrency(value){
            let selectedCurrencyArray = this.withdrawCurrencies.find(x => x.id == value);
            this.selectedWithdrawCurrency = selectedCurrencyArray.ticker_default;
        },
        changeDepositCurrency(value){
            let selectedCurrencyArray = this.depositCurrencies.find(x => x.id == value);
            this.selectedDepositCurrency = selectedCurrencyArray.ticker_default;
        },        
        changeFee(value){
            if(value == 'percentage'){
                this.theWidth = 178
            }else{
                this.theWidth = 113
            }
        },
        savePost() {
            let that = this;

            if(this.form.withdrawCurrencyId == this.baseCurrency.id){
                this.form.withdrawValue = 1;
            }

            if(this.form.depositCurrencyId == this.baseCurrency.id){
                this.form.depositValue = 1;
            }

            if (!(this.form.sourceId && this.form.withdrawAmount && this.form.exchangeId && this.form.depositAmount && this.form.fee_amount && this.form.depositCurrencyId)) {
                this.$parent.$parent.messageModal = true
                this.$parent.$parent.status = 'danger'
                this.$parent.$parent.message = 'Please fill all the requiered field!'
                $('#myModal').animate({scrollTop: 0}, 500, 'swing')
                return false
            }

            // Set date transaction
            let dateObj = moment(this.$parent.$parent.form.theDate)._isValid ? new Date(this.$parent.$parent.form.theDate) : new Date("1 "+this.$parent.$parent.form.theDate)
            dateObj.setDate(dateObj.getDate()+1)

            // Sent data to API
			this.axios.post('/deposit', {
                transaction_at: dateObj,
                from: this.form.sourceId,
                withdraw_amount: this.form.withdrawAmount,
                withdraw_currency_id: this.form.withdrawCurrencyId,
                withdraw_in_base: this.form.withdrawValue,
                to_exchange_id: this.form.exchangeId,
                deposit_amount: this.form.depositAmount,
                deposit_currency_id: this.form.depositCurrencyId,
                deposit_in_base: this.form.depositValue,
                fee: this.form.fee,
                fee_amount: this.form.fee_amount,
                fee_type: this.form.fee_type,
                comment: this.form.comment
            })
            .then(response => {
                if (response.data.status == 'success') {
                    alert('success')
                    this.status = response.data.status
                    this.message = response.data.message
                    this.$parent.$parent.reload()
                    this.$parent.$parent.closeModal()
                }else {
                    this.status = 'warning'
                    this.message = 'Sorry, the system can not execute the command'
                    //this.$parent.$parent.closeModal()
                }
            })
            .catch(e => {
				this.messageModal = true
				this.status = 'danger'
				this.message = e.response.data.message
				this.errors = e.response.data.errors
            })
        },
        editPost(){
            if(this.form.withdrawCurrencyId == this.baseCurrency.id){
                this.form.withdrawValue = 1;
            }

            if(this.form.depositCurrencyId == this.baseCurrency.id){
                this.form.depositValue = 1;
            }

            if (!(this.form.sourceId && this.form.withdrawAmount && this.form.exchangeId && this.form.depositAmount && this.form.fee_amount && this.form.depositCurrencyId)) {
                this.$parent.$parent.messageModal = true
                this.$parent.$parent.status = 'danger'
                this.$parent.$parent.message = 'Please fill all the requiered field!'
                $('#myModal').animate({scrollTop: 0}, 500, 'swing')
                return false
            }

            // Set date transaction
            let dateObj = moment(this.$parent.$parent.form.theDate)._isValid ? new Date(this.$parent.$parent.form.theDate) : new Date("1 "+this.$parent.$parent.form.theDate)
            dateObj.setDate(dateObj.getDate()+1)

            // Sent data to API
            this.axios.put('/deposit/'+this.dataTransaction.transactionable.id, {
                transaction_at: dateObj,
                from: this.form.sourceId,
                withdraw_amount: this.form.withdrawAmount,
                withdraw_currency_id: this.form.withdrawCurrencyId,
                withdraw_in_base: this.form.withdrawValue,
                to_exchange_id: this.form.exchangeId,
                deposit_amount: this.form.depositAmount,
                deposit_currency_id: this.form.depositCurrencyId,
                deposit_in_base: this.form.depositValue,
                fee: this.form.fee,
                fee_amount: this.form.fee_amount,
                fee_type: this.form.fee_type,
                comment: this.form.comment
            })
            .then(response => {
                if (response.data.status == 'success') {
                    this.status = response.data.status
                    this.message = response.data.message
                    this.$parent.$parent.reload()
                    this.$parent.$parent.closeModal()
                    //this.$refs.vuetable.refresh()
                }else {
                    this.status = 'warning'
                    this.message = 'Sorry, the system can not execute the command'
                    this.$parent.$parent.closeModal()
                    //this.$refs.vuetable.reload()
                }
            })
            .catch(e => {
                //this.messageModal = true
                this.status = 'danger'
                alert("catch")
                //this.message = e.response.data.message
                //this.errors = e.response.data.errors
                //this.$refs.vuetable.reload()
            })
        },
        selectedCurrency(obj, url){
            let transferCompare = this.axios.create({
                baseURL: url,
                timeout: 3000,
            });
            transferCompare.get()
            .then(response => {
                this.form[obj] = response.data[this.baseCurrency.ticker_default]
                return false;
            }).catch(error => {
                console.log(error)
                return false;
            })
        },
    },
    beforeDestroy() {
        this.$eventHub.$off('eventSaveTransaction');
        this.$eventHub.$off('eventEditTransaction');
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

</style>