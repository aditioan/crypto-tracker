<template>
    <div id="transactionContainer">
        <div v-if="loader" class="centerSpinner">
            <atom-spinner :animation-duration="1000" :size="100" :color="'#fd7e14'"  />
        </div>

    	<form v-else>
	        <table class="table table-striped">
			  <tbody>
			    <tr>
			      <th scope="row">Transfered Amount*</th>
			      <td>
			      	<div class="form-group">
                        <b-row class="tranfer">
                        	<b-col md="9" style="padding-left:5px;">
                                <vue-autonumeric v-model.number="form.amount" :disabled="!form.currency_id" :options="{decimalPlaces: decimal, minimumValue: '0' }" :placeholder="'Enter amount'"  class="amountInput form-control"></vue-autonumeric>
                            </b-col>
                            <b-col md="3" style="padding-left:5px;">
                                <b-form-select v-model="form.currency_id" class="inputCurrency" required >
                                    <option v-for="currencytype in digital_currencies" :value="currencytype.id">{{ currencytype.ticker_default }}</option>
                                </b-form-select>
                            </b-col>
                        </b-row>
                    </div>
			      </td>
			    </tr>
			    <tr>
			      <th scope="row">From *</th>
			      <td>
			      	<div class="form-group">
                        <b-row class="tranfer">
                            <b-col md="12" style="padding-left:5px;">
                                <b-form-select :disabled="!form.currency_id" v-model="form.from" class="inputFrom" required >
                                   <!--  <option v-for="source in exchanges" :value="'exchange_'+exchange.id">{{ exchange.name }}</option> -->
                                    <option v-for="wallet in wallets" :disabled="disabledOption('wallet_'+wallet.id, form.from, form.to)" :value="'wallet_'+wallet.id">{{ wallet.name }}</option>
                                    <option value="outside">Outside</option>
                                </b-form-select>
                            </b-col>
                        </b-row>
                    </div>
			      </td>
			    </tr>
			    <tr><!-- Address from -->
			      <th scope="row">From Address *</th>
			      <td>
			      	<div class="form-group">
                        <b-row class="tranfer">
                            <b-col md="9" style="padding-left:5px;">
                                <input v-if="form.from=='outside'" type="text" placeholder="Address..." v-model="form.from_address" class="form-control" />
                                <b-form-select v-else v-model="form.from_address" :options="fromAddresses" :text-field="'address'" :value-field="'address'" class="inputFrom" >
                                    <template slot="first">
                                        <option :value="''" disabled>-- Select Address --</option>
                                    </template>                                    
                                </b-form-select>
                            </b-col>
                            <b-col md="3" style="padding-left:5px;">
                                <b-btn :id="'addressFromExplorer'" :disabled="disabledButtonAddressFrom" variant="outline-warning">Verify</b-btn>
                            </b-col>
                            <b-popover :target="'addressFromExplorer'"
                                placement="auto"
                                :show.sync="popoverShow.addressFrom"
                                triggers="click">
                                <template slot="title">
                                    <b-btn @click="onOk(3)" class="close" aria-label="Close">
                                      <span class="d-inline-block" aria-hidden="true">&times;</span>
                                    </b-btn>
                                    Address Explorer
                                </template>
                                <div class="embed-responsive embed-responsive-16by9">
                                    <object :data="addressFromExplorer" type="text/html">
                                        <p><b>Opps! Sorry, we can't load the address in this domain.</b> <br> Please open it in new tab <a :href="addressFromExplorer" target="_blank">{{ addressFromExplorer }}</a></p>
                                    </object>
                                </div>
                                <div>
                                    <b-btn @click="onOk(3)" class="float-right" size="sm" variant="warning">Ok</b-btn>
                                </div>
                            </b-popover>
                        </b-row>
                    </div>
			      </td>
			    </tr>
			    <tr>
			      <th scope="row">To *</th>
			      <td>
			      	<div class="form-group">
                        <b-row class="tranfer">
                            <b-col md="12" style="padding-left:5px;">
                                <b-form-select :disabled="!form.currency_id" v-model="form.to" class="inputTo" required >
                                    <!-- <option v-for="exchange in exchanges" :value="'exchange_'+exchange.id">{{ exchange.name }}</option> -->
                                    <option v-for="wallet in wallets" :disabled="disabledOption('wallet_'+wallet.id, form.from, form.to)" :value="'wallet_'+wallet.id">{{ wallet.name }}</option>
                                    <option value="outside">Outside</option>
                                </b-form-select>
                            </b-col>
                        </b-row>
                    </div>
			      </td>
			    </tr>
			    <tr><!-- Address to -->
			      <th scope="row">To Address *</th>
			      <td>
			      	<div class="form-group">
                        <b-row class="tranfer">
                        	<b-col md="9" style="padding-left:5px;">
                                <!-- <b-form-select :disabled="!form.currency_id" v-model="form.address" class="addressInput" required >
                                    <option v-for="item in selected_address" :value="item.address">{{ item.address }}</option>
                                </b-form-select> -->
                                <b-form-input v-if="form.to=='outside'" type="text" placeholder="Address..." :disabled="!form.currency_id" v-model="form.to_address" class="addressInput" required></b-form-input>
                                <b-form-select v-else v-model="form.to_address" :options="toAddresses" :text-field="'address'" :value-field="'address'" class="inputFrom" >
                                    <template slot="first">
                                        <option :value="''" disabled>-- Select Address --</option>
                                    </template>                                    
                                </b-form-select>

                            </b-col>
                            <b-col md="3" style="padding-left:5px;">
                            	<b-btn :id="'addressToExplorer'" :disabled="disabledButtonAddressTo" variant="outline-warning">Verify</b-btn>
                            </b-col>
                            <b-popover :target="'addressToExplorer'"
                        		placement="auto"
               					:show.sync="popoverShow.addressTo"
				                triggers="click">
					            <template slot="title">
							        <b-btn @click="onOk(1)" class="close" aria-label="Close">
							          <span class="d-inline-block" aria-hidden="true">&times;</span>
							        </b-btn>
							        Address Explorer
							    </template>
							    <div class="embed-responsive embed-responsive-16by9">
                                    <object :data="addressToExplorer" type="text/html">
                                        <p><b>Opps! Sorry, we can't load the address in this domain.</b> <br> Please open it in new tab <a :href="addressToExplorer" target="_blank">{{ addressToExplorer }}</a></p>
                                    </object>
								</div>
							    <div>
							        <b-btn @click="onOk(1)" class="float-right" size="sm" variant="warning">Ok</b-btn>
							    </div>
					        </b-popover>
                        </b-row>
                    </div>
			      </td>
			    </tr>
			    <tr>
			      <th scope="row">Transaction Hash *</th>
			      <td>
			      	<div class="form-group">
                        <b-row class="tranfer">
                        	<b-col md="9" style="padding-left:5px;">
                                <b-form-input type="text" placeholder="Transaction hash..." :disabled="!form.currency_id" v-model="form.transaction_hash" class="addressInput" required></b-form-input>
                            </b-col>
                            <b-col md="3" style="padding-left:5px;">
                            	<b-btn :id="'hashExplorer'" :disabled="disabledButtonTransaction" variant="outline-warning">Verify</b-btn>
                            </b-col>
                            <b-popover :target="'hashExplorer'"
                        		placement="auto"
               					:show.sync="popoverShow.hash"
				                triggers="click">
					            <template slot="title">
							        <b-btn @click="onOk(2)" class="close" aria-label="Close">
							          <span class="d-inline-block" aria-hidden="true">&times;</span>
							        </b-btn>
							        Transaction Hash Explorer
							    </template>
							    <div class="embed-responsive embed-responsive-16by9">
                                	<object :data="transactionExplorer" type="text/html">
                                        <p><b>Opps! Sorry, we can't load the address in this domain.</b> <br> Please open it in new tab <a :href="transactionExplorer" target="_blank">{{ transactionExplorer }}</a></p>
                                    </object>
								</div>
							    <div>
							        <b-btn @click="onOk(2)" class="float-right" size="sm" variant="warning">Ok</b-btn>
							    </div>
					        </b-popover>
                        </b-row>
                    </div>
			      </td>
			    </tr>
                <tr v-show="outsideTransaction">
                  <th scope="row">{{ nameCurrency }} to AUD</th>
                  <td>
                    <div class="form-group">
                        <b-row class="tranfer">
                            <b-col md="9" style="padding-left:5px;">
                                <input placeholder="Price coin in AUD..." v-model="form.amount_in_base" class="audInput form-control" required />
                            </b-col>
                            <b-col md="3" style="padding-left:5px;">
                                <b-button :variant="'outline-secondary'" style="width:36px !important; padding: 3px 2px 2px !important"><i class="fal fa-cloud-download" style="font-size:22px;"></i></b-button>
                            </b-col>
                        </b-row>
                    </div>
                  </td>
                </tr>
			    <tr>
			      <th scope="row">Fee *</th>
			      <td>
			      	<div class="form-group">
                        <b-row class="tranfer">
                        	<b-col md="3" style="padding-left:5px;">
                        		<b-form-select v-model="form.fee" :disabled="!form.currency_id" class="inputFeeType" required >
                                    <option value="percentage">Percentage</option>
                                    <option value="flat">Flat</option>
                                </b-form-select>
                            </b-col>
                            <b-col md="9" style="padding-left:5px;">
                                <b-input-group>
								    <b-input-group-text slot="append">
								        <strong>{{ nameCurrency }}</strong>
								    </b-input-group-text>
								    
                                	<b-form-input type="number" placeholder="Amount..." :disabled="!form.currency_id" v-model="form.fee_amount" class="amountInput" required></b-form-input>
								</b-input-group>
                            </b-col>
                            <b-col md="12">
                                - The fee will be deducted from transferred amount
                            </b-col>
                        </b-row>
                    </div>
                	<!-- <b-form-group>
                    	<b-form-radio-group id="radiosFee" :disabled="!form.currency_id" v-model="form.fee_type" :options="options" name="radioFee">
				      	</b-form-radio-group>
			      	</b-form-group> -->
			      </td>
			    </tr>
			    <tr>
			      <th scope="row">Transfered Total</th>
			      <td> <b>{{ totalAmount }}</b> {{ nameCurrency }}</td>
			    </tr>
			    <tr>
			      <th scope="row">Comment</th>
			      <td>
			      	<div class="form-group">
                        <b-row class="tranfer">
                        	<b-col md="12" style="padding-left:5px;">
                                <b-form-textarea type="text" placeholder="Comment..." v-model="form.comment" class="commentInput" :rows="3" :max-rows="6"></b-form-textarea>
                            </b-col>
                        </b-row>
                    </div>
			      </td>
			    </tr>
			    <tr>
			    	<th colspan="2">* Required field</th>
			    </tr>
			  </tbody>
			</table>
		</form>
    </div>
</template>
<style type="text/css">
.popover {
	width: 275px;
	height: 400px;
}
.embed-responsive {
	height: 300px;
}
</style>
<script>
import {AtomSpinner} from 'epic-spinners';
import {VMoney} from 'v-money';
import VueAutonumeric from 'vue-autonumeric';

export default {
    props: ['exchangesProps', 'walletsProps', 'dataTransactionProps'],
    data() {
		return {
            loader: true,
            status: null,
            message: '',
            decimal: 2,
            form: {
            	amount: 0,
            	currency_id: 0,
            	from: '',
            	to: '',
            	from_address: '',
                to_address: '',
            	transaction_hash: '',
            	fee: 'percentage',
            	fee_type: 'included',
            	fee_amount: 0,
            	comment: '',
                amount_in_base: 0,
            	transaction_at: '',
            },
            exchanges: [],
            fromAddresses: [],
            toAddresses: [],
            wallets: [],
            dataTransaction: this.dataTransactionProps,
            digital_currencies: [],
            // fiat_currencies: [],
            selected_address: [],
            options: [
            	{text: 'Additive', value: 'additive'},
            	{text: 'Included', value: 'included'}
            ],
		    popoverShow: {
                addressFrom: false,
		    	addressTo: false,
		    	hash: false
		    },
            urlApi: {
                address: '',
                transaction: '',
            },
            urlEmpty: {
                address: true,
                transaction: true
            },
            outsideTransaction: false,
		}
    },
    components: {
      AtomSpinner,
      VMoney,
      VueAutonumeric,
    },
    watch: {
    	'form.currency_id': function (val) {
    		// this.selected_address = []
            if (!this.digital_currencies.length) {
                this.axios.get('/currency/show/supportive-storage')
                    .then(response => {
                     this.digital_currencies = response.data.data
                     this.loader = false
                     this.currencySelection(val)
                    }).catch(error => {
                     console.log(error)
                    })
            } else {
                this.currencySelection(val)
            }
    	},
        'form.from': function (val) {
            if (val == 'outside') {
                let self = this
                let selectedCurrencyArray = this.digital_currencies.filter(function(x){ return x.id == self.form.currency_id })
                let selectedTransferCurrency = selectedCurrencyArray[0].ticker_default
                let url = "https://min-api.cryptocompare.com/data/price?fsym="+selectedTransferCurrency+"&tsyms=AUD"
                let transferCompare = this.axios.create({
                    baseURL: url,
                    timeout: 3000,
                });
                transferCompare.get()
                .then(response => {
                    self.form.amount_in_base = response.data.AUD
                }).catch(error => {
                    console.log(error)
                })

                this.outsideTransaction = true
            } else {
                this.outsideTransaction = false
                let self = this
                let theValue = val.split("_")
                
                switch(theValue[0]){
                    case "exchange" :
                        setTimeout(function(){
                            let theExchange = self.exchanges.filter(function(x){ return x.id == theValue[1]; });
                            self.fromAddresses = theExchange[0].addresses
                        }, 1000);
                        break;
                    case "wallet" :
                        setTimeout(function(){
                            let theWallet = self.wallets.filter(function(x){ return x.id == theValue[1]; });
                            self.fromAddresses = theWallet[0].addresses
                        }, 1000);
                        break;
                    default :
                        console.log(val)
                }
            }
        },
        'form.to': function (val) {
            if (val == 'outside') {
                let self = this
                let selectedCurrencyArray = this.digital_currencies.filter(function(x){ return x.id == self.form.currency_id })
                let selectedTransferCurrency = selectedCurrencyArray[0].ticker_default
                let url = "https://min-api.cryptocompare.com/data/price?fsym="+selectedTransferCurrency+"&tsyms=AUD"
                let transferCompare = this.axios.create({
                    baseURL: url,
                    timeout: 3000,
                });
                transferCompare.get()
                .then(response => {
                    self.form.amount_in_base = response.data.AUD
                }).catch(error => {
                    console.log(error)
                })

                this.outsideTransaction = true
            } else {
                this.outsideTransaction = false
                let self = this
                let theValue = val.split("_")
                switch(theValue[0]){
                    case "exchange" :
                        setTimeout(function(){
                            let theExchange = self.exchanges.filter(function(x){ return x.id == theValue[1]; });
                            self.toAddresses = theExchange[0].addresses
                        }, 1000);
                        break;
                    case "wallet" :
                        setTimeout(function(){
                            let theWallet = self.wallets.filter(function(x){ return x.id == theValue[1]; });
                            self.toAddresses = theWallet[0].addresses
                        }, 1000);
                        break;
                    default :
                        console.log(val)
                }                
            }
        }
    },
    computed: {
    	nameCurrency: function () {
            let currency = this.form.currency_id
    		let ticker = this.digital_currencies.filter(function(x){ return x.id == currency })
            if (ticker.length) {
                return ticker[0].ticker_default
            }
    	},
    	totalAmount: function () {
    		var total_amount = this.form.amount
    		if (this.form.fee == 'percentage' && this.form.fee_type == 'included') {
    			total_amount = parseInt(this.form.amount) - (parseInt(this.form.fee_amount)/100*parseInt(this.form.amount))
    		}
    		if (this.form.fee == 'flat' && this.form.fee_type == 'included') {
    			total_amount = parseInt(this.form.amount) - parseInt(this.form.fee_amount)
    		}
    		if (this.form.fee_amount == 0 || this.form.fee_amount == '' || this.form.fee_amount == undefined || this.form.fee_type == 'additive') {
    			total_amount = this.form.amount
    		}
    		return total_amount
    	},
        disabledButtonAddressFrom:  function () {
            return (this.popoverShow.address || this.urlEmpty.address || this.form.from_address == '')
        },
        disabledButtonAddressTo:  function () {
            return (this.popoverShow.address || this.urlEmpty.address || this.form.to_address == '')
        },
        disabledButtonTransaction:  function () {
            return (this.popoverShow.transaction || this.urlEmpty.transaction || this.form.transaction_hash == '')
        },
        addressFromExplorer: function () {
            return this.urlApi.address+this.form.from_address
        },
        addressToExplorer: function () {
            return this.urlApi.address+this.form.to_address
        },
        transactionExplorer: function () {
            return this.urlApi.transaction+this.form.transaction_hash
        }
    },
    created() {
        // get data digital currency only
        this.axios.get('/currency/show/supportive-storage')
            .then(response => {
             this.digital_currencies = response.data.data
             this.loader = false
            }).catch(error => {
             console.log(error)
            })

        // get data fiat currency only
        // this.axios.get('/currency/show/filter?classification=fiat')
        //     .then(response => {
        //      this.fiat_currencies = response.data.data
        //      this.loader = false
        //     }).catch(error => {
        //      console.log(error)
        //     })

        //Listen to save event from any component .ex from parent
        this.$eventHub.$on('eventSaveTransaction', this.savePost)
        this.$eventHub.$on('eventEditTransaction', this.editPost)
    },
    mounted () {
        // assign data when update
        if (this.dataTransaction) {
            this.form.amount = parseInt(this.dataTransaction.transactionable.amount)
            this.form.currency_id = this.dataTransaction.transactionable.currency_id
            this.form.from = (this.dataTransaction.transactionable.fromable_type == 'App\\Models\\Wallet'?'wallet_':'exchange_')+this.dataTransaction.transactionable.fromable_id
            this.form.to = (this.dataTransaction.transactionable.toable_type == 'App\\Models\\Wallet'?'wallet_':'exchange_')+this.dataTransaction.transactionable.toable_id
            this.form.from_address = this.dataTransaction.transactionable.from_address
            this.form.to_address = this.dataTransaction.transactionable.to_address
            this.form.transaction_hash = this.dataTransaction.transactionable.transaction_hash
            this.form.fee = this.dataTransaction.transactionable.fee
            this.form.fee_amount = (this.dataTransaction.transactionable.fee == "percentage") ? this.dataTransaction.transactionable.fee_amount : this.dataTransaction.transactionable.fee_amount*100/this.dataTransaction.transactionable.amount
            this.form.fee_type = this.dataTransaction.transactionable.fee_type
            this.form.comment = this.dataTransaction.transactionable.comment
        }
    },
    methods: {
        savePost() {
            this.$parent.$parent.messageModal = false

            // check if data is empty
            if (!(this.form.amount > 0 && this.form.currency_id && this.form.from && this.form.to && this.form.from_address && this.form.to_address && this.form.transaction_hash && this.form.fee_amount)) {
                this.$parent.$parent.messageModal = true
                this.$parent.$parent.status = 'danger'
                this.$parent.$parent.message = 'Please fill all the requiered fields!'
                $('#myModal').animate({scrollTop: 0}, 500, 'swing')
                return false
            }

            // sent data to API
            var dateObj = new Date(this.$parent.$parent.form.theDate)
            dateObj.setDate(dateObj.getDate()+1)
            this.form.transaction_at = dateObj

            this.axios.post('/transfer', this.form)
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

            // check if data is empty
            if (!(this.form.amount && this.form.currency_id && this.form.from && this.form.to && this.form.from_address && this.form.to_address && this.form.transaction_hash && this.form.fee_amount)) {
                this.$parent.$parent.messageModal = true
                this.$parent.$parent.status = 'danger'
                this.$parent.$parent.message = 'Please fill all the requiered fields!'
                $('#myModal').animate({scrollTop: 0}, 500, 'swing')
                return false
            }

            // sent data to API
            var dateObj = new Date(this.$parent.$parent.form.theDate)
            dateObj.setDate(dateObj.getDate()+1)
            this.form.transaction_at = dateObj

            this.axios.put('/transfer/'+this.dataTransaction.transactionable_id, this.form)
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
	    onOk (type) {
            switch(type){
                case 1:
                    this.popoverShow.addressTo = false
                    break;
                case 2:
                    this.popoverShow.hash = false
                    break;
                default:
                    this.popoverShow.addressFrom = false
            }
	    },
        currencySelection (val) {
            this.digital_currencies.forEach((item) => {
                if (item.id == val) {
                    this.decimal = item.decimal_displayed
                    item.supportive_wallets.forEach((val) => {
                        // this.selected_address.push(val)
                        this.wallets.push(val)
                    })
                    // item.supportive_exchanges.forEach((val) => {
                        // this.exchanges.push(item.supportive_exchanges)
                    // })
                    if (item.url_address) {
                        this.urlApi.address = item.url_address
                        this.urlEmpty.address = false
                    }
                    if (item.url_api) {
                        this.urlApi.transaction = item.url_api
                        this.urlEmpty.transaction = false
                    }
                }
            })

            let self = this
            let selectedCurrencyArray = this.digital_currencies.filter(function(x){ return x.id == self.form.currency_id })
            let selectedTransferCurrency = selectedCurrencyArray[0].ticker_default
            let url = "https://min-api.cryptocompare.com/data/price?fsym="+selectedTransferCurrency+"&tsyms=AUD"
            let transferCompare = this.axios.create({
                baseURL: url,
                timeout: 3000,
            });
            transferCompare.get()
            .then(response => {
                self.form.amount_in_base = response.data.AUD
            }).catch(error => {
                console.log(error)
            })
        },
        disabledOption(id, from, to) {
            if (id == from || id == to) {
                return true
            } else {
                return false
            }
        },
    },
	filters: {
		decimalLimit: function (value) {
			return (value+1)
		}
	},
    directives: {money: VMoney},
    beforeDestroy() {
        this.$eventHub.$off('eventSaveTransaction')
        this.$eventHub.$off('eventEditTransaction')
    },  
}
</script>