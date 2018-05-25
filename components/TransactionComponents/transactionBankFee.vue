<template>
    <div class="transactionContainer">

    <div v-if="loader" class="centerSpinner">
        <atom-spinner :animation-duration="1000" :size="100" :color="'#fd7e14'"  />
    </div>
    <div v-else>
	    <h1 class="head">Bank Fees</h1>
	    <b-card no-body class="bankInterest">
	        <form>
	            <b-form-group id="inputToGroup" :label-cols="2" label="Bank Name *" label-for="inputTo" horizontal :invalid-feedback="feedbackTo" :state="stateTo">
					<b-row>
						<b-col sm="5">
	                        <b-form-select id="inputTo" class="form-control" size="sm" :options="bankAccounts" :text-field="'bank_name'" :value-field="'id'" v-model="form.account_id" :state="stateTo">
	                            <template slot="first">
	                                <option :value="null" disabled>-- Select Bank Account --</option>
	                            </template>
	                        </b-form-select>
						</b-col>
					</b-row>
	            </b-form-group>
				<b-form-group id="inputAmountGroup" :label-cols="2" label="Amount *" label-for="inputAmount" horizontal :invalid-feedback="feedbackAmount" :state="stateAmount">
					<b-row>
						<b-col sm="5">
	                        <b-input-group id="inputAmount" size="sm">
	                            <!-- <b-form-input type="text" style="width:171px;" v-model="form.fee_amount" :state="stateAmount" placeholder="enter amount" class="text-right pr-3"></b-form-input> -->
                                <vue-autonumeric v-model.number="form.fee_amount" :options="{decimalPlaces: decimal, minimumValue: '0' }" style="width:171px;" :placeholder="'Enter amount'"  class="amountInput text-right pr-3 form-control"></vue-autonumeric>
	                            <b-form-select class="form-control" style="width:69px;" size="sm" :options="currencies" :text-field="'ticker_default'" :value-field="'id'" v-model="form.currency_id" @change="changeCurrency"></b-form-select>
	                        </b-input-group>
	                    </b-col>
						<!-- <b-col sm="6" style="padding-right:0;" v-if="baseCurrency.ticker_default!=selectedCurrency">
	                        <b-form-group id="inputValueGroup" label="Value" label-for="inputValue" horizontal :invalid-feedback="feedbackValue" :state="stateValue" style="margin-bottom:0px !important;">
	                            <b-input-group size="sm">
	                                <b-input-group-text slot="append">{{ baseCurrency.ticker_default }}/{{ selectedCurrency }}</b-input-group-text>                            
	                                <b-form-input id="inputValue"  type="text" v-model="form.value" :state="stateValue" placeholder="enter value" class="text-right pr-3"></b-form-input>
	                            </b-input-group>
	                        </b-form-group>
						</b-col>
						<b-col sm="1" style="padding-left:0;" v-if="baseCurrency.ticker_default!=selectedCurrency">
	                        <b-button :variant="'outline-secondary'" style="width:36px !important; padding: 3px 2px 2px !important"><i class="fal fa-cloud-download" style="font-size:22px;"></i></b-button>
	                    </b-col> -->
					</b-row>
	      		</b-form-group>
				<!-- <b-form-group id="inputFeeGroup" :label-cols="2" label="" label-for="inputFee" horizontal>
                    <b-row>
                        <b-col sm="5">                       
                            <b-input-group size="sm">                           
                                <b-form-input type="text" style="width:135px;" v-model="form.withdraw_percentage" placeholder="enter fee" class="text-right pr-3"></b-form-input>
                                <b-form-select id="inputFee" style="width:35px" class="form-control" size="sm" v-model="form.withdrawalType">
                                    <option value="percentage">%</option>
                                    <option value="flat">Flat</option>
                                </b-form-select>
                                <b-input-group-text slot="append">%</b-input-group-text>
                            </b-input-group>
                        </b-col>
                    </b-row>
                </b-form-group> -->
	        </form>
	    </b-card>

	    <h1 class="head">Interest Fees</h1>
	    <b-card no-body class="bankInterest">
	        <form>
	            <!-- <b-form-group id="inputToGroup" :label-cols="2" label="Bank Name *" label-for="inputTo" horizontal :invalid-feedback="feedbackTo" :state="stateTo">
					<b-row>
						<b-col sm="5">
	                        <b-form-select id="inputTo" class="form-control" size="sm" :options="bankAccounts" :text-field="'bank_name'" :value-field="'id'" v-model="form.interest_account" :state="stateTo">
	                            <template slot="first">
	                                <option :value="null" disabled>-- Select Bank Account --</option>
	                            </template>
	                        </b-form-select>
						</b-col>
					</b-row>
	            </b-form-group> -->
				<!-- <b-form-group id="inputAmountGroup" :label-cols="2" label="Amount *" label-for="inputAmount" horizontal :invalid-feedback="feedbackAmount" :state="stateAmount">
					<b-row>
						<b-col sm="5">
	                        <b-input-group id="inputAmount" size="sm">
	                            <b-form-input type="text" style="width:171px;" v-model="form.interest_amount" :state="stateAmount" placeholder="enter amount" class="text-right pr-3"></b-form-input>
	                            <b-form-select class="form-control" style="width:69px;" size="sm" :options="currencies" :text-field="'ticker_default'" :value-field="'id'" v-model="form.interest_currency" @change="changeCurrency"></b-form-select>
	                        </b-input-group>
	                    </b-col>
						<b-col sm="6" style="padding-right:0;" v-if="baseCurrency.ticker_default!=selectedCurrency">
	                        <b-form-group id="inputValueGroup" label="Value" label-for="inputValue" horizontal :invalid-feedback="feedbackValue" :state="stateValue" style="margin-bottom:0px !important;">
	                            <b-input-group size="sm">
	                                <b-input-group-text slot="append">{{ baseCurrency.ticker_default }}/{{ selectedCurrency }}</b-input-group-text>                            
	                                <b-form-input id="inputValue"  type="text" v-model="form.value" :state="stateValue" placeholder="enter value" class="text-right pr-3"></b-form-input>
	                            </b-input-group>
	                        </b-form-group>
						</b-col>
						<b-col sm="1" style="padding-left:0;" v-if="baseCurrency.ticker_default!=selectedCurrency">
	                        <b-button :variant="'outline-secondary'" style="width:36px !important; padding: 3px 2px 2px !important"><i class="fal fa-cloud-download" style="font-size:22px;"></i></b-button>
	                    </b-col>
					</b-row>
	      		</b-form-group> -->
				<b-form-group id="inputFeeGroup" :label-cols="2" label="Fee *" label-for="inputFee" horizontal>
                    <b-row>
                        <b-col sm="5">                       
                            <b-input-group size="sm">                           
                                <b-form-input type="text" style="width:135px;" v-model="form.interest_percentage" placeholder="enter fee" class="text-right pr-3"></b-form-input>
                                <!-- <b-form-select id="inputFee" style="width:35px" class="form-control" size="sm" v-model="form.interestType">
                                    <option value="percentage">%</option>
                                    <option value="flat">Flat</option>
                                </b-form-select> -->
                                <b-input-group-text slot="append">%</b-input-group-text>
                            </b-input-group>
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

    </div>
</template>


<script>
import {AtomSpinner} from 'epic-spinners'
import VueAutonumeric from 'vue-autonumeric'

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
            bankAccounts: this.bankAccountsProps,
            currencies: this.currenciesProps.filter(function(x){ return x.classification == 'fiat'; }),
            baseCurrency: this.baseCurrencyProp,
            selectedCurrency: null,
            loader: false,
            errors: [],
            decimal: this.baseCurrencyProp.decimal_displayed,
			form: {
                account_id: null,
                fee_amount: 0,
                currency_id: this.baseCurrencyProp.id,
                // withdraw_percentage: 0,
                // interest_account: null,
                // interest_amount: 0,
                // interest_currency: this.baseCurrencyProp.id,
                interest_percentage: 0,
                comment: '',
                transaction_at: '',
			},            
        }
    },
    components: {
      AtomSpinner,
      VueAutonumeric,
    },
    watch: {
        'form.currency_id': function (val) {
            let currencySelected = this.currencies.find(x => x.id == val )
            this.decimal = currencySelected.decimal_displayed
        },
    },
    created() {
        //Listen to save event from any component .ex from parent
        this.$eventHub.$on('eventSaveTransaction', this.savePost);
        this.$eventHub.$on('eventEditTransaction', this.editPost);
    },
    mounted(){
        if(this.dataTransactionProps != null){
            // let that = this;
            // let selectedCurrencyArray = this.currencies.find(x => x.id == that.dataTransactionProps.transactionable.currency_id);

            this.form.account_id = this.dataTransactionProps.transactionable.account_id;
            this.form.fee_amount = this.dataTransactionProps.transactionable.fee_amount;
            this.form.currency_id = this.dataTransactionProps.transactionable.currency_id;
            this.form.interest_percentage = this.dataTransactionProps.transactionable.interest_percentage;
            this.form.comment = this.dataTransactionProps.transactionable.comment;
        }
        // else{
        //     this.form.currencyid = this.baseCurrency.id
        //     this.selectedCurrency = this.baseCurrency.ticker_default
        // }
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
        changeCurrency(value){
            let selectedCurrencyArray = this.currencies.find(x => x.id == value);
            this.selectedCurrency = selectedCurrencyArray.ticker_default;
        },
		savePost() {
            // if(this.form.currencyid == this.baseCurrency.id){
            //     this.form.value = 1;
            // }

            if (!(this.form.account_id && this.form.fee_amount && this.form.interest_percentage)) {
                this.$parent.$parent.messageModal = true
                this.$parent.$parent.status = 'danger'
                this.$parent.$parent.message = 'Please fill all the requiered fields!'
                $('#myModal').animate({scrollTop: 0}, 500, 'swing')
                return false
            }

            // Set date transaction
            let dateObj = moment(this.$parent.$parent.form.theDate)._isValid ? new Date(this.$parent.$parent.form.theDate) : new Date("1 "+this.$parent.$parent.form.theDate)
            dateObj.setDate(dateObj.getDate()+1)

            // Sent data to API
            this.form.transaction_at = dateObj

			this.axios.post('/bank-interest', this.form)
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
                this.$parent.$parent.messageModal = true
                this.$parent.$parent.status = 'danger'
                this.$parent.$parent.message = 'Oops, something wrong!'
                $('#myModal').animate({scrollTop: 0}, 500, 'swing')
            })
        },
		editPost() {
            // if(this.form.currencyid == this.baseCurrency.id){
            //     this.form.value = 1;
            // }

            if (!(this.form.account_id && this.form.fee_amount && this.form.interest_percentage)) {
                this.$parent.$parent.messageModal = true
                this.$parent.$parent.status = 'danger'
                this.$parent.$parent.message = 'Please fill all the requiered fields!'
                $('#myModal').animate({scrollTop: 0}, 500, 'swing')
                return false
            }

            // Set date transaction
            let dateObj = moment(this.$parent.$parent.form.theDate)._isValid ? new Date(this.$parent.$parent.form.theDate) : new Date("1 "+this.$parent.$parent.form.theDate)
            dateObj.setDate(dateObj.getDate()+1)

            // Sent data to API
            this.form.transaction_at = dateObj

			this.axios.put('/bank-interest/' + this.dataTransactionProps.transactionable_id, this.form)
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
                this.$parent.$parent.messageModal = true
                this.$parent.$parent.status = 'danger'
                this.$parent.$parent.message = 'Oops, something wrong!'
                $('#myModal').animate({scrollTop: 0}, 500, 'swing')
            })


		}

    },
    beforeDestroy() {
        this.$eventHub.$off('eventSaveTransaction');
        this.$eventHub.$off('eventEditTransaction');
    },    
}
</script>

<style>
.card.bankInterest{
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
.bankInterest .dropdown-item{
    font-size: 14px;
    padding: 5px 15px;
}
</style>