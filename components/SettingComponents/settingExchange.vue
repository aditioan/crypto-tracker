<template>	
<div class="container">
	<h1>SETTINGS - Exchanges</h1>

	<div class="topBar">
		<b-btn v-b-modal.myModal class="btn btn-primary float-right" @click="clearForm">Add Exchange</b-btn>	
	</div>

	<b-modal id="myModal" ref="modal" size="lg" :title="modalHeader" @hidden="onHidden">
		<b-alert :variant="status" dismissible :show="messageModalAlert">
			{{ message }}
		</b-alert>

		<form>
			<b-form-group label-cols="2" id="inputNameGroup" label="Exchange" label-for="inputName" horizontal :invalid-feedback="feedbackName" :state="stateName">
				<b-form-input id="inputName" size="sm" type="text" v-model="form.name" placeholder="Enter exchange name" :state="stateName"></b-form-input>
			</b-form-group>
			<b-form-group label-cols="2" id="inputCountryGroup" label="Country" label-for="inputCountry" horizontal :invalid-feedback="feedbackCountry" :state="stateCountry">
				<v-select id="inputCountry" class="form-control" size="sm" :options="countries" label="name" placeholder="Choose country" v-model="form.country" :state="stateCountry"></v-select>
			</b-form-group>
			<b-form-group label-cols="2" id="inputFiatGroup" label="Allow Fiat Money" label-for="inputFiat" horizontal :invalid-feedback="feedbackFiat" :state="stateFiat">
				<b-form-radio-group id="inputFiat" v-model="form.fiat" name="inputFiat" :state="stateFiat">
					<b-form-radio value="1">Yes</b-form-radio>
					<b-form-radio value="0">No</b-form-radio>
				</b-form-radio-group>
			</b-form-group>
			<b-form-group label-cols="2" id="inputUrlGroup" label="Website" label-for="inputUrl" horizontal :invalid-feedback="feedbackUrl">
				<b-form-input id="inputUrl" size="sm" type="url" v-model="form.url" :state="stateUrl" placeholder="http://www.example.com"></b-form-input>
			</b-form-group>

			<b-form-group label-cols="2" id="inputAddressGroup" label="Coin Supported" label-for="inputAddressName" horizontal :invalid-feedback="feedbackAddressName" :state="stateAddressName">
				<div v-for="(addresses, index) in form.addresses" :key="index">
					<b-row class="addressRow" style="margin-bottom:5px;">
						<b-col style="max-width:130px; padding-right:10px; padding-left: 7px;">
							<b-form-select v-model="addresses.currency_id" size="sm" class="inputCoin" required :state="stateAddressName">
								<option v-for="currency in currencies" :key="currency.id" :value="currency.id">{{ currency.ticker_default }}</option>	
							</b-form-select>
						</b-col>
						<b-col style="padding-left:5px">
							<b-form-input type="text" v-model="addresses.address" placeholder="Address" :state="stateAddressName" class="addressInput" required></b-form-input>
						</b-col>
						<b-col style="max-width:42px; padding-left:5px; padding-top:6px;">
							<a @click="removeAddress(index)"><i class="fa fa-minus-square"></i></a>
						</b-col>
					</b-row>
				</div>
				<b-row>
					<b-col class="addressAdd">
						<a @click="addAddress"><i class="fa fa-plus-square"></i> </a> Add Coin &amp; address
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
		
		<b-alert v-if="status && messageModal === false" :variant="status" dismissible show>
			{{ message }}
		</b-alert>

		<vuetable	ref="vuetable"
					api-url="exchange/show/vue-table"
					:css="css"
					:fields="fields"
					pagination-path=""
					@vuetable:pagination-data="onPaginationData"
					:http-fetch="myFetch"
		>
			<template slot="actions" slot-scope="props">
				<a href="#" @click="editRow(props.rowData)" class="table-button h-100 d-inline-block rounded"><i class="far fa-eye"></i></a>
			</template>
		</vuetable>

		<vuetable-pagination	ref="pagination"
								:css="css.pagination"
								@vuetable-pagination:change-page="onChangePage"
		></vuetable-pagination>
	
	</div>
</div>

</template>

<script>
import BootstrapStyle from '../bootstrap-css.js'

export default {
	data() {
		return {
			modalHeader: 'Add Exchange',
			css: BootstrapStyle,
			status: null,
			message: '',
			messageModal: true,
			countries: [],
			fields: [
				{
					name: '__slot:actions',
					dataClass: 'table-button-tdcontainer'
				},				
				{
					name: 'name',
					title: 'Exchange Name',
					dataClass: 'font-weight-bold'
				},				 
				{
					name: 'country.name',
					title: 'Country'
				},
				{
					name: 'fiat_money',
					title: 'Fiat',
					callback: 'fiat'
				},
				{
					name: 'url',
					title: 'website',
					callback: 'url'
				}
			],
			errors: [],
			form:{
				name: null,
				url: null,
				country: null,
				fiat: null,
				deposit:null,
				updateId: null,
				addresses: [],
				currency_id: null,
				currencies: []
			}
		}
	},
	created() {
		this.axios.get('/country')
		.then(response => {
			this.countries = response.data.data;
		}).catch(error => {
			this.status = error.response.data.status
			this.message = error.response.data.message
		})

		this.axios.get('/currency?limit=1000')
		.then(response => {
			this.currencies = response.data.data
		}).catch(error => {
			this.status = error.response.data.status
			this.message = error.response.data.message
		})

	},
	computed: {
		messageModalAlert(){
			return (this.status == 'danger' && this.messageModal == true) ? true : false
		},
		messageTableAlert(){
			return (this.status && this.messageModal == false) ? true : false
		},
		stateName() {
			return this.errors.name  ? false : 'normal'
		},
		feedbackName() {
			return this.errors.name ? this.errors.name[0] : ''
		},
		stateUrl() {
			return this.errors.url  ? false : 'normal'
		},
		feedbackUrl() {
			return this.errors.url ? this.errors.url[0] : ''
		},
		stateFiat() {
			return this.errors.fiat_money ? false : 'normal'
		},
		feedbackFiat() {
			return this.errors.fiat_money ? this.errors.fiat_money[0] : ''
		},
		stateCountry() {
			return this.errors.country_id  ? false : 'normal'
		},
		feedbackCountry() {
			return this.errors.country_id ? this.errors.country_id[0] : ''
		},
		stateAddressName() {
			return this.errors.currencies ? false : 'normal'
		},
		feedbackAddressName() {
			return this.errors.currencies ? this.errors.currencies[0] : ''
		},			
	},
	methods: {
		addhttp(url) {
			if(!/^http(s)?:\/\/(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(url)){
				url = 'http://' + url
			}
			return url;
		},
		fiat: function(value) {
			return value == 1 ? "yes" : "no"
		},
		url: function(value) {
			var valueHref = this.addhttp(value)
			return '<a target="_blank" href="' + valueHref +'"> ' + value + ' </a>'
		},
		onPaginationData (paginationData) {
		this.$refs.pagination.setPaginationData(paginationData)
		},
		onChangePage (page) {
		this.$refs.vuetable.changePage(page)
		},
		onHidden(evt){
			this.messageModal = false
			this.status = null
		},
		myFetch(apiUrl, httpOptions) {
			return this.axios.get(apiUrl, httpOptions)
		},	
		editRow(rowData){
			this.errors = []			
			this.modalHeader = 'Edit Exchange'
			this.form.name = rowData.name
			this.form.url = rowData.url
			this.form.country = rowData.country
			this.form.fiat = rowData.fiat_money
			this.form.updateId = rowData.id
			this.$refs.modal.show()
			this.status = null
			this.form.addresses = (rowData.exchange_currencies != null) ? rowData.exchange_currencies : []
		},
		clearForm() {
			this.modalHeader = 'Add Exchange',
			this.form.name = null
			this.form.url = null
			this.form.fiat = null
			this.form.updateId = null
			this.form.country = null
			this.$refs.modal.hide()
			this.messageModal = false
			this.status = null
			this.form.addresses = []
		},
		savePost(evt) {
			evt.preventDefault()
			this.axios.post('/exchange', {
        		name: this.form.name,
				url: this.form.url,
				country_id: this.form.country ? this.form.country.id : '',
				fiat_money: this.form.fiat,
				currencies:this.form.addresses
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
			this.axios.put('/exchange/' + this.form.updateId, {
				name: this.form.name,
				url: this.form.url,
				country_id: this.form.country ? this.form.country.id : '',
				fiat_money: this.form.fiat,
				currencies:this.form.addresses
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
					this.axios.delete('/exchange/'+ self.form.updateId)
						.then(response => {
							self.status = response.data.status
							self.message = response.data.message
							self.$refs.modal.hide()
							self.$refs.vuetable.reload()
						}).catch(error => {
							self.messageModal = true
							self.status = error.response.data.status
							self.message = error.response.data.message
						})
			}
			let obj = {
				title: 'Delete Exchange',
				message: 'Exchange <strong>"' + this.form.name + '"</strong> will be deleted',
				type: 'warning',
				useConfirmBtn: true,
    		onConfirm: confirmFn
			}
			this.$Simplert.open(obj)
		},
		addAddress(index) {
			var that = this;

			if($(".addressRow").length > 0){
				$(".addressRow").each(function(index){

					var tmpAddress = $(".addressInput",this).val();
					var tmpCoin = $(".inputCoin",this).val();
					var isLastElement = index == $(".addressRow").length-1;

					if(	tmpAddress && tmpCoin ){
						if(isLastElement){
							that.form.addresses.push({ currency_id: '', address: '' })
						}
					}else{
						
					}
				})

			}else{
				that.form.addresses.push({ currency_id: '', address: '' })
			}
		},
		removeAddress(index) {
			this.form.addresses.splice(index, 1)
		}
  }
}
</script>

<style scoped>
.v-select{
	font-family: 'Open Sans';
	padding: 0px 5px;
}
.selected-tag{
	margin:2px 1px 0 3px !important;
	padding: 1px .25em !important;
}
.v-select .dropdown-toggle .clear{
	display:none;
}
.v-select .open-indicator {
    height: 18px;
}
.addressAdd{
	height:33px;
	padding-left:17px;
	padding-top:8px;
}
.addressInput{
	font-size:14px;
	padding: 4px 8px !important;
}
.inputCoin{
	margin:0px 8px;
}
</style>