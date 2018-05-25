<template>

<div class="container">
	<h1>SETTINGS - Currencies</h1>	

	<div class="topBar">
		<b-btn v-b-modal.myModal class="btn btn-primary float-right" @click="clearForm">Add Currency</b-btn>	
	</div>

	<b-modal id="myModal" ref="modal" size="lg" :title="modalHeader" @hidden="onHidden" @dismissed="clearError">
		<b-alert :variant="status" dismissible :show="messageModalAlert">
			{{ message }}
		</b-alert>

    	<form>
			<b-form-group label-cols="2" id="inputNameGroup" label="Currency Name" label-for="inputName" horizontal :invalid-feedback="feedbackName" :state="stateName">
				<b-row>
					<b-col sm="5"><b-form-input id="inputName" size="sm" type="text" v-model="form.name" placeholder="Currency Name" :state="stateName"></b-form-input></b-col>
					<b-col sm="7" style="padding-top:5px;"><b-form-checkbox plain id="inputBase" v-model="form.base_currency" value="1" unchecked-value="0">System Base Currency</b-form-checkbox></b-col>
				</b-row>
      		</b-form-group>
			<b-form-group label-cols="2" id="inputTickerGroup" label="Ticker" label-for="inputTicker" horizontal :invalid-feedback="feedbackTicker" :state="stateTicker">
				<tags-input class="form-control" id="inputTicker" placeholder="Currency Ticker" on-paste-separator="," :tags="form.type" validate="text" :class="{ 'is-invalid': stateTicker }" :state="stateTicker"></tags-input>
				<b-form-text id="inputTickerHelp">Type in a ticker and then press enter, you can add multiple tickers</b-form-text>
			</b-form-group>
			<b-form-group label-cols="2" id="inputLogoGroup" label="Logo" label-for="currencyLogo" horizontal >
				<div class="logoInput">
					<div style="width:80px; height:80px; border:1px solid #ced4da;">
						<div v-if="form.logo">
							<img id="currencyLogo" v-bind:src="form.logo" style="width:80px; height:80px;">
						</div>
					</div>
					<input type="file" id="upload-image" v-on:change="setUpFileUpload" accept="image/*">
					<label for="upload-image" class="btn-outline-secondary fileupload">Browse...</label>
				</div>
			</b-form-group>
			<b-form-group label-cols="2" id="inputDecimalGroup" label="Displayed Decimal" label-for="inputDecimal" horizontal :invalid-feedback="feedbackDecimal" :state="stateDecimal">
				<b-form-select v-model="form.decimal_displayed" id="inputDecimal" size="sm" :state="stateDecimal">
					<option :value="null"> -- Select Displayed Decimal -- </option>
					<option value="1">1 (0.1)</option>
					<option value="2">2 (0.02)</option>
					<option value="3">3 (0.003)</option>
					<option value="4">4 (0.0004)</option>
					<option value="5">5 (0.00005)</option>
					<option value="6">6 (0.000006)</option>
					<option value="7">7 (0.0000007)</option>
					<option value="8">8 (0.00000008)</option>
				</b-form-select>
			</b-form-group>
			<b-form-group label-cols="2" id="inputClassificationGroup" label="Classification" label-for="inputClassification" horizontal :invalid-feedback="feedbackClassification" :state="stateClassification">
				<b-form-select v-model="form.classification" id="inputClassification" size="sm" :state="stateClassification">
					<option :value="null">-- Select Classification --</option>
					<option value="fiat">Fiat</option>
					<option value="digital">Digital</option>
				</b-form-select>
			</b-form-group>			
			<b-form-group label-cols="2" id="inputLiquidityGroup" label="Liquidity Risk" label-for="inputLiquidity" horizontal :invalid-feedback="feedbackLiquidity" :state="stateLiquidity">
				<b-form-select v-model="form.liquidity_risk" id="inputLiquidity" size="sm" :state="stateLiquidity">
					<option :value="null">-- Select Liquidity Risk --</option>
					<option value="lowest">Lowest</option>
					<option value="low">Low</option>
					<option value="medium">Medium</option>
					<option value="high">High</option>
					<option value="highest">Highest</option>
				</b-form-select>
			</b-form-group>
			<b-form-group v-if="form.classification=='digital'" label-cols="2" id="inputURLAddressGroup" label="Address Explorer" label-for="inputURLAddress" horizontal :invalid-feedback="feedbackURLAddress" :state="stateURLAddress">
				<b-form-input id="inputURLAddress" size="sm" type="text" v-model="form.addressURL" placeholder="URL" :state="stateURLAddress"></b-form-input>
			</b-form-group>
			<b-form-group v-if="form.classification=='digital'" label-cols="2" id="inputURLTransactionGroup" label="Tx Explorer" label-for="inputURLTransaction" horizontal :invalid-feedback="feedbackURLTransaction" :state="stateURLTransaction">
				<b-form-input id="inputURLTransaction" size="sm" type="text" v-model="form.transactionURL" placeholder="URL" :state="stateURLTransaction"></b-form-input>
			</b-form-group>
			<b-form-group v-if="form.classification=='digital'" label-cols="2" id="inputAddressGroup" label="Address(es)" label-for="inputAddressName" horizontal :invalid-feedback="feedbackAddressName" :state="stateAddressName">
				<b-row class="addressRow" style="margin-bottom:5px; margin-left:0px;" v-for="(addresses, index) in form.addresses" :key="index">
					<b-form-input type="text" v-model="addresses.address" placeholder="Address" :state="stateAddressName" class="addressInputCurrency" required></b-form-input>
					<a @click="removeAddress(index)" style="margin:6px 10px;"><i class="fa fa-minus-square"></i></a>
				</b-row>
				<b-row>
					<b-col class="addressAdd">
						<a @click="addAddress"><i class="fa fa-plus-square"></i> </a> Add Address
					</b-col>
				</b-row>
			</b-form-group>
		</form>

		<div slot="modal-footer">
			<b-btn size="sm" variant="secondary" @click="clearForm">Close</b-btn>
			<b-btn size="sm" variant="danger" v-if="form.updateId != null" @click="deleteRow">Delete</b-btn>
			<b-btn size="sm" variant="primary" v-if="form.updateId != null" @click="editPost">Edit Changes</b-btn>
			<b-btn size="sm" variant="primary" v-if="form.updateId == null" @click="savePost">Save Changes</b-btn>
    	</div>
  	</b-modal>	
	
	<div class="divContent">

		<vuetable ref="vuetable"
		api-url="currency/show/vue-table" 
		:css="css" 
		:fields="fields" 
		pagination-path="" 
		@vuetable:pagination-data="onPaginationData" 
		:http-fetch="myFetch"
		>

			<template slot="actions" slot-scope="props">
				<a href="#" @click="editRow(props.rowData)" class="table-button h-100 d-inline-block rounded"><i class="far fa-eye"></i></a>
			</template>

			<template slot="logo" slot-scope="props">
				<a class="coin" href="#">
					<div class="coinLogo">
						<img v-bind:src="props.rowData.logo ? props.rowData.logo.original_image : '/static/images/spacer.png'" />
					</div>
					<h6>{{ props.rowData.ticker_default }}</h6>
					<small>{{ props.rowData.name }}</small>
				</a>
			</template>

			<template slot="base" slot-scope="props">
				<div>
					<i class="fa fa-check" v-if="props.rowData.base_currency == '1'"></i>
				</div>
			</template>
		</vuetable>

		<vuetable-pagination ref="pagination"
		:css="css.pagination" 
		@vuetable-pagination:change-page="onChangePage">
		</vuetable-pagination>
	
	</div>
	
</div>

</template>

<script>
import BootstrapStyle from '../bootstrap-css.js'
import BetterInputTag from 'better-vue-input-tag'

var isBase64 = require('is-base64');

export default {
	components: {
		tagsInput: BetterInputTag
	},
	data() {
		return {
			modalHeader: 'Add Currency',
			css: BootstrapStyle,
			status: null,
			message: '',
			messageModal: true,
			fields: [
				{
					name: '__slot:actions',
					dataClass: 'table-button-tdcontainer'
				},
				{
					name: '__slot:logo',
					title: 'Currency',
					dataClass: 'table-currency-tdcontainer'
				},
				{
					name: '__slot:base',
					title: 'Base',
					dataClass: 'table-base-tdcontainer'
				},				
				{
					name: 'tickers',
					callback: 'tickerAlt'
				},
				{
					name: 'classification',
					title: 'Classification',
					dataClass: 'table-classification-tdcontainer'
				},
				{
					name: 'liquidity_risk',
					title: 'Liquidity Risk',
					dataClass: 'table-liquidity-tdcontainer'
				}

			],
			errors: [],
			form: {
				name: null,
				updatedId: null,
				type: [],
				addresses: [],
				base_currency: null,
				logo: null,
				addressURL: null,
				transactionURL: null,
				classification: null
			}
	
		}
	},
	computed: {
		messageModalAlert(){
			return (this.status == 'danger' && this.messageModal == true) ? true : false
		},
		messageTableAlert(){
			return (this.status && this.messageModal == false) ? true : false
		},
		stateName() {
			return this.errors.name ? false : 'normal'
		},
		feedbackName() {
			return this.errors.name ? this.errors.name[0] : ''
		},
		stateTicker() {
			return this.errors.tickers  ? 'normal' : false
		},
		feedbackTicker() {
			return this.errors.tickers ? this.errors.tickers[0] : ''
		},
		stateAddressName() {
			return this.errors.addresses ? false : 'normal'
		},
		feedbackAddressName() {
			return this.errors.addresses ? this.errors.addresses[0] : ''
		},		
		stateDecimal() {
			return this.errors.decimal_displayed  ? false : 'normal'
		},
		feedbackDecimal() {
			return this.errors.decimal_displayed ? this.errors.decimal_displayed[0] : ''
		},
		stateClassification() {
			return this.errors.classification  ? false : 'normal'
		},
		feedbackClassification() {
			return this.errors.classification ? this.errors.classification[0] : ''
		},
		stateLiquidity() {
			return this.errors.liquidity_risk  ? false : 'normal'
		},
		feedbackLiquidity() {
			return this.errors.liquidity_risk ? this.errors.liquidity_risk[0] : ''
		},
		stateURLAddress() {
			return this.errors.url_address  ? false : 'normal'
		},
		feedbackURLAddress() {
			return this.errors.url_address ? this.errors.url_address[0] : ''
		},
		stateURLTransaction() {
			return this.errors.url_api  ? false : 'normal'
		},
		feedbackURLTransaction() {
			return this.errors.url_api ? this.errors.url_api[0] : ''
		},				
	},

	methods: {
		onPaginationData (paginationData) {
			this.$refs.pagination.setPaginationData(paginationData)
		},
		onChangePage (page) {
			this.$refs.vuetable.changePage(page)
		},
		onHidden(evt){
			this.messageModal = false
			this.errors = []
		},		
		myFetch(apiUrl, httpOptions) {
			return this.axios.get(apiUrl, httpOptions)
		},
		addAddress(index) {
			var that = this;

			if($(".addressRow").length > 0){
				$(".addressRow").each(function(index){
					var tmpAddress = $(".addressInputCurrency",this).val();
					var isLastElement = index == $(".addressRow").length-1;

					if(	tmpAddress ){
						if(isLastElement){
							that.form.addresses.push({ id:null, address: '' })
						}
					}else{
						
					}
				})
			}else{
				that.form.addresses.push({ id:null, address: '' })
			}

		},
		removeAddress(index) {
			this.form.addresses.splice(index, 1)
		},
		editRow(rowData){
			const typeTemp = JSON.parse(JSON.stringify(rowData.tickers))

			this.clearForm()
			this.modalHeader = 'Edit Currency',
			this.form.name = rowData.name
			this.form.base_currency = rowData.base_currency
			this.form.type =  typeTemp
			this.form.logo = rowData.logo ? rowData.logo.original_image : null
			this.form.decimal_displayed = rowData.decimal_displayed
			this.form.classification = rowData.classification
			this.form.liquidity_risk = rowData.liquidity_risk
			this.form.addressURL = rowData.url_address
			this.form.transactionURL = rowData.url_api
			this.form.updateId = rowData.id
			this.$refs.modal.show()
			this.status = null
			this.form.addresses = rowData.addresses
		},
		clearForm() {
			this.modalHeader = 'Add Currency',
			this.form.name = null
			this.form.type = []
			this.form.logo = null
			this.form.decimal_displayed = null
			this.form.classification = null
			this.form.liquidity_risk = null
			this.form.updateId = null
			this.form.addressURL = null
			this.form.transactionURL = null
			this.form.base_currency = "0"
			this.$refs.modal.hide()
			this.messageModal = false
			this.status = null
			this.form.addresses = [{ id:null, address: '' }]
		},
		savePost(evt) {
			evt.preventDefault()

			this.axios.post('/currency', {
				name: this.form.name,
				base_currency: this.form.base_currency,
				tickers: this.form.type,
				logo: this.form.logo,
				decimal_displayed: this.form.decimal_displayed,
				classification: this.form.classification,
				liquidity_risk: this.form.liquidity_risk,
				url_address: this.form.addressURL,
				url_api: this.form.transactionURL,
				addresses:this.form.addresses

			})
			.then(response => {
				if (response.data.status == 'success') {
					this.status = response.data.status
					this.message = response.data.message
					this.$refs.modal.hide()
					this.$refs.vuetable.refresh()
				}else {
					this.status = 'warning'
					this.message = 'Sorry, the system can not execute the command'
					this.$refs.modal.hide()
					this.$refs.vuetable.reload()
				}
			})
			.catch(e => {
				this.messageModal = true
				this.status = 'danger'
				this.message = e.response.data.message
				this.errors = e.response.data.errors
				this.$refs.vuetable.reload()
    		})
		},
		editPost(evt) {
			evt.preventDefault()

			this.axios.put('/currency/' + this.form.updateId, {
				name: this.form.name,
				base_currency: this.form.base_currency,
				tickers: this.form.type,
				logo: isBase64(this.form.logo) ? this.form.logo : "",
				decimal_displayed: this.form.decimal_displayed,
				classification: this.form.classification,
				liquidity_risk: this.form.liquidity_risk,
				url_address: this.form.addressURL,
				url_api: this.form.transactionURL,				
				addresses:this.form.addresses,
				user_price: "0"
    		})
			.then(response => {
				if (response.data.status == 'success') {
					this.status = response.data.status
					this.message = response.data.message
					this.$refs.modal.hide()
					this.$refs.vuetable.reload()
				}else {
					this.status = 'warning'
					this.message = 'Sorry, the system can not execute the command'
					this.$refs.modal.hide()
					this.$refs.vuetable.reload()
				}
			})
			.catch(e => {
				this.messageModal = true
				this.status = 'danger'
				this.message = e.response.data.message
				this.errors = e.response.data.errors
				this.$refs.vuetable.reload()
			})
		},
		deleteRow(evt){
			var self = this
			let confirmFn = function() {
				this.axios.delete('/currency/'+ self.form.updateId)
				.then(response => {
					self.status = response.data.status
					self.message = response.data.message
					self.$refs.modal.hide()
					self.$refs.vuetable.reload()
				})
				.catch(error => {
					self.messageModal = true
					self.status = error.response.data.status
					self.message = error.response.data.message
				})
			}
			let obj = {
				title: 'Delete Currency',
				message: 'Currency <strong>"' + this.form.name + '"</strong> will be deleted',
				type: 'warning',
				useConfirmBtn: true,
    		onConfirm: confirmFn
			}
			this.$Simplert.open(obj)
		},
		setUpFileUpload(e){
			var input = e.target;
			if(input.files && input.files[0]){
				var reader = new FileReader();
				reader.onload = (event) => {
					this.form.logo = event.target.result;
				}
				reader.readAsDataURL(input.files[0]);
			}
		},
		tickerAlt: function(value){
			return value.join(', ');
		},
		clearError(){
			alert();
			$(".is-invalid").removeClass();
			this.errors = []
		}

  	}	


}
</script>

<style>
.table-classification-tdcontainer, .table-liquidity-tdcontainer{
	text-transform: capitalize;
}
.table-base-tdcontainer{
	width:50px;
	text-align:center;
}
.table-currency-tdcontainer{
	width: 150px !important;
	padding: 0.5rem 0.75rem !important;
}
.coinLogo{
	float:left;
	width:30px;
	height:22px;
}
.coinLogo img{
	width:23px;
	height:23px;
}

.table-bordered td{
	vertical-align:middle;
}
a.coin{
	display:block;
	font-weight:bold;
	text-decoration:none;
	line-height: 0.8;
}
a.coin i{
	display:block;
	float:left;
	font-size:22px;
	padding-right:5px;
}
a.coin h6{
	text-transform:uppercase;
	margin-bottom: 0rem;
	line-height: 0.8;
	font-weight: 700;
}
a.coin small{
	display:block;
	font-size:85%;
	padding-top:2px;
	margin-left:28px;
}
.logoInput{
  width:80px;
  float: left;
  margin-right:10px;
  margin-bottom:4px;
}
.btn-outline-secondary{
	display:block;
	font-size:13px;
	padding: 3px 7px;	
	border-radius: 0.15rem;
	width:80px;
	margin:4px;
}
.btn-outline-secondary.fileupload{
	margin:0px !important;
	margin-top:2px !important;
	text-align:center;
	padding:2px 6px !important;
}
#upload-image{
	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
}
#upload-image + label {
	border:1px solid #6c757d;
    display: inline-block;
}
#upload-image:focus + label,
#upload-image + label:hover {
    background-color: #6c757d;
}
.vue-input-tag-wrapper{
	padding: 5px 5px !important;
}
.vue-input-tag-wrapper .input-tag {
	background-color: #3e8acc !important;
	border-color: #3e8acc !important;
	color: #fff !important;
	border-radius: 3px;
}
.vue-input-tag-wrapper .input-tag .remove {
	color: #fff !important;
}
.form-text {
	display: block;
	margin-left:2px;
    margin-top: 0.15rem;
    margin-bottom: 0.25rem;
}
.vue-input-tag-wrapper .input-tag{
	padding: 2px 5px !important;
	margin-bottom: 0px !important;
}
.vue-input-tag-wrapper .input-tag a{
	margin-left:2px;
}
.vue-input-tag-wrapper .new-tag{
	margin-bottom:0 !important;
}

.addressAdd{
	height:33px;
	padding-left:17px;
	padding-top:8px;
}
.addressInputCurrency{
	font-size:14px;
	padding: 4px 8px !important;
	width: 610px;
}
.inputWallet{
	width:200px;
	margin:0px 8px;
}

.addressInputInvalid{
	border-color:#dc3545;
}

#inputTickerGroup .invalid-feedback{
	margin-top:0 !important;
	padding-left: 2px !important;
}

#inputTickerHelp{
	margin-bottom:0 !important;
}

#inputLogoGroup{
	margin-top:10px;
}
</style>

