<template>
    <div class="transactionContainer">

    <div v-if="loader" class="centerSpinner">
        <atom-spinner :animation-duration="1000" :size="100" :color="'#fd7e14'"  />
    </div>

    <b-card no-body class="investorFund" v-else>
        <form>
			<b-form-group id="inputAmountGroup" :label-cols="2" label="Amt. Received*" label-for="inputAmount" horizontal :invalid-feedback="feedbackAmount" :state="stateAmount">
				<b-row>
					<b-col sm="5">
                        <b-input-group id="inputAmount" size="sm">
                            <vue-autonumeric style="width:171px;" v-model.number="form.amount" :options="{decimalPlaces:decimal, minimumValue:'0' }" :state="stateAmount" :placeholder="'enter amount'"  class="text-right pr-3 form-control"></vue-autonumeric>
                            <b-form-select class="form-control" style="width:69px;" size="sm" :options="currencies" :text-field="'ticker_default'" :value-field="'id'" v-model="form.currencyid" @change="changeCurrency"></b-form-select>
                        </b-input-group>
                    </b-col>
					<b-col sm="6" style="padding-right:0;">
                        <b-form-group id="inputValueGroup" label="Value" label-for="inputValue" horizontal :invalid-feedback="feedbackValue" :state="stateValue" style="margin-bottom:0px !important;">
                            <b-input-group size="sm">
                                <b-input-group-text slot="append">{{ baseCurrency.ticker_default }}/{{ selectedCurrency }}</b-input-group-text>                            
                                <vue-autonumeric v-model.number="form.value" :options="{decimalPlaces:2, minimumValue:'0' }" :state="stateValue" :placeholder="'enter value'"  class="text-right pr-3 form-control"></vue-autonumeric>
                            </b-input-group>
                        </b-form-group>
					</b-col>
					<b-col sm="1" style="padding-left:0;">
                        <b-button :variant="'outline-secondary'" style="width:36px !important; padding: 3px 2px 2px !important">
                            <i :class="[ isLoading ? 'fal fa-spinner fa-spin' : 'fal fa-cloud-download' ]" style="font-size:22px;"></i>
                        </b-button>
                    </b-col>
				</b-row>
      		</b-form-group>
            <b-form-group id="inputToGroup" :label-cols="2" label="To*" label-for="inputTo" horizontal :invalid-feedback="feedbackTo" :state="stateTo">
				<b-row>
					<b-col sm="5">
                        <b-form-select id="inputTo" class="form-control" size="sm" v-model="form.storeToId" :state="stateTo">
                            <template slot="first">
                                <option :value="null" disabled v-if="currClass=='fiat'">-- Select Bank Accounts --</option>
                                <option :value="null" disabled v-else-if="currClass=='digital'">-- Select Wallets --</option>
                            </template>
                            <template v-if="currClass=='fiat'">
                                <option v-for="(acc) in bankAccounts" :key='acc.id' :value='"account_"+acc.id'>{{ acc.bank_name }}</option>
                            </template>
                            <template v-else-if="currClass=='digital'">
                                <option v-for="(wal) in wallets" :key='wal.id' :value='"wallet_"+wal.id'>{{ wal.name }}</option>
                            </template>                            
                        </b-form-select>
					</b-col>
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
import VueAutonumeric from 'vue-autonumeric'
import {AtomSpinner} from 'epic-spinners'

export default {
    props: {
        baseCurrencyProp :{default: null},
        dataTransactionProps :{default: null},
        currenciesProps :{default: null},
        bankAccountsProps :{default: null},
    },
    data() {
		return {
			status: null,
			message: '',            
            bankAccounts: [],
            wallets: [],
            currencies: [],
            baseCurrency: [],
            selectedCurrency: null,
            decimal: 2,
            loader: false,
            currClass: 'fiat',
            errors: [],
            isLoading: false,
			form: {
                amount: null,
                value: null,
                currencyid: null,
                storeToId: null,
                account_id: null,
                wallet_id: null,
                comment: null,
                txDate: null
			},            
        }
    },
    components: {
      AtomSpinner,
      VueAutonumeric
    },
    created() {

        this.bankAccounts = this.bankAccountsProps
        this.currencies = this.currenciesProps;
        this.baseCurrency = this.baseCurrencyProp
        this.axios.get('/currency/show/supportive-storage')
            .then(response => {
                this.currencies = response.data.data
            }).catch(error => {
                console.log(error)
            })

        //Listen to save event from any component .ex from parent
        this.$eventHub.$on('eventSaveTransaction', this.savePost);
        this.$eventHub.$on('eventEditTransaction', this.editPost);
        this.$eventHub.$on('eventDateChange', this.dateChange);

    },
    mounted(){
        if(this.dataTransactionProps != null){
            var that = this;
            var selectedCurrencyArray = this.currencies.filter(function(x){ return x.id == that.dataTransactionProps.transactionable.currency_id; });
            
            this.decimal = selectedCurrencyArray[0].decimal_displayed
            this.currClass = selectedCurrencyArray[0].classification

            if(this.currClass=='fiat'){
                this.form.storeToId = 'account_'+this.dataTransactionProps.transactionable.toable_id
            }else if(this.currClass=='digital'){
                this.getWallet(this.dataTransactionProps.transactionable.currency_id)
                this.form.storeToId = 'wallet_'+this.dataTransactionProps.transactionable.toable_id
            }

            this.selectedCurrency = selectedCurrencyArray[0].ticker_default;
            this.form.amount = Number(this.dataTransactionProps.transactionable.amount);
            this.form.value = Number(this.dataTransactionProps.transactionable.amount_in_base);
            this.form.currencyid = this.dataTransactionProps.transactionable.currency_id;
            this.baseCurrency = this.currencies.filter(function(x){ return x.id == that.dataTransactionProps.transactionable.base_currency_id; });
            this.baseCurrency = this.baseCurrency[0];
            this.form.comment = this.dataTransactionProps.transactionable.comment;
            this.$parent.$parent.form.theDate = moment(this.dataTransactionProps.transaction_at).format("DD MMMM YYYY")

        }else{
            this.form.currencyid = this.baseCurrency.id
            this.selectedCurrency = this.baseCurrency.ticker_default
            this.form.txDate = this.$parent.$parent.form.theDate
            this.form.value = 1
        }
    },
    watch: {
        'form.currencyid': function (val) {
            var curr = this.currencies.filter(function (x){return x.id == val})
            if (curr[0] != undefined) {
                this.wallets = curr[0].supportive_wallets
            }
        }
    },
	computed: {
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
		stateTo() {
			return this.errors.account_id ? false : 'normal'
		},
		feedbackTo() {
			return this.errors.account_id ? this.errors.account_id[0] : ''
		},
		stateComment() {
			return this.errors.Comment  ? false : 'normal'
		},
		feedbackComment() {
			return this.errors.Comment ? this.errors.Comment[0] : ''
		}
    },
    methods: {
        dateChange(){
            this.getValue(this.selectedCurrency)
        },
        getWallet(value){
            this.axios.get('/currency/' + value)
            .then(response => {
                this.wallets = response.data.data.supportive_wallets
            }).catch(error => {
                console.log(error)
            })
        },
        changeCurrency(value){
            var selectedCurrencyArray = this.currencies.filter(function(x){ return x.id == value; });

            this.selectedCurrency = selectedCurrencyArray[0].ticker_default;
            this.decimal = selectedCurrencyArray[0].decimal_displayed;
            this.currClass = selectedCurrencyArray[0].classification

            this.getWallet(value)
            this.getValue(this.selectedCurrency)

        },
        getValue(value){
            if(value!=this.baseCurrency.ticker_default){

                var txDateUnix = moment(this.$parent.$parent.form.theDate, "DD MMMM YYYY").unix()
                var transferCompare = this.axios.create({
                    baseURL: 'https://min-api.cryptocompare.com/data/dayAvg?fsym='+ value + '&tsym=' + this.baseCurrency.ticker_default + '&toTs=' + txDateUnix,
                    timeout: 3000,
                });
                transferCompare.get()
                .then(response => {
                    this.form.value = response.data[this.baseCurrency.ticker_default]
                    return false;
                }).catch(error => {
                    console.log(error)
                    return false;
                })

            }else{
                this.form.value = 1;
                this.isLoading = false;
            }
        },
		savePost() {

            alert("save")

            if(this.form.currencyid == this.baseCurrency.id){
                this.form.value = 1;
            }

            if (!(this.form.amount && this.form.storeToId)) {
                this.$parent.$parent.messageModal = true
                this.$parent.$parent.status = 'danger'
                this.$parent.$parent.message = 'Please fill all the requiered fields!'
                $('#myModal').animate({scrollTop: 0}, 500, 'swing')
                return false
            }
            
            var dateObj = new Date(this.$parent.$parent.form.theDate)
            dateObj.setDate(dateObj.getDate()+1)

			this.axios.post('/investor-fund', {
                amount: this.form.amount,
                amount_in_base: this.form.value,
				currency_id: this.form.currencyid,
				to: this.form.storeToId,
                transaction_at: dateObj,
                comment: this.form.comment,
                type: "1",
            })
            .then(response => {
                if (response.data.status == 'success') {
                    this.status = response.data.status
                    this.message = response.data.message
                    //alert("success")
                    this.$parent.$parent.reload()
                    this.$parent.$parent.closeModal()
                    //this.$refs.vuetable.refresh()
                }else {
                    this.status = 'warning'
                    this.message = 'Sorry, the system can not execute the command'
                    //alert("warning")
                    this.$parent.$parent.closeModal()
                    //this.$refs.vuetable.reload()
                }
            })
            .catch(e => {
                //this.messageModal = true
                this.status = 'danger'
                //alert("catch")
                //this.message = e.response.data.message
                //this.errors = e.response.data.errors
                //this.$refs.vuetable.reload()
            })
        },
		editPost() {
            if(this.form.currencyid == this.baseCurrency.id){
                this.form.value = 1;
            }

            if (!(this.form.amount && this.form.storeToId)) {
                this.$parent.$parent.messageModal = true
                this.$parent.$parent.status = 'danger'
                this.$parent.$parent.message = 'Please fill all the requiered fields!'
                $('#myModal').animate({scrollTop: 0}, 500, 'swing')
                return false
            }

			this.axios.put('/investor-fund/' + this.dataTransactionProps.transactionable_id, {
                amount: this.form.amount,
                amount_in_base: this.form.value,
				currency_id: this.form.currencyid,
				//account_id: this.form.bankid,
                to: this.form.storeToId,
                transaction_at: this.$parent.$parent.form.theDate,
                comment: this.form.comment,
                type: "1",
            })
            .then(response => {
                if (response.data.status == 'success') {
                    this.status = response.data.status
                    this.message = response.data.message
                    //alert("success")
                    this.$parent.$parent.reload()
                    this.$parent.$parent.closeModal()
                    //this.$refs.vuetable.refresh()
                }else {
                    this.status = 'warning'
                    this.message = 'Sorry, the system can not execute the command'
                    //alert("warning")
                    this.$parent.$parent.closeModal()
                    //this.$refs.vuetable.reload()
                }
            })
            .catch(e => {
                //this.messageModal = true
                this.status = 'danger'
                //alert("catch")
                //this.message = e.response.data.message
                //this.errors = e.response.data.errors
                //this.$refs.vuetable.reload()
            })

		}

    },
    beforeDestroy() {
        this.$eventHub.$off('eventSaveTransaction');
        this.$eventHub.$off('eventEditTransaction');
        this.$eventHub.$off('eventDateChange');
    },    
}
</script>

<style>
.card.investorFund{
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
.investorFund .dropdown-item{
    font-size: 14px;
    padding: 5px 15px;
}
</style>