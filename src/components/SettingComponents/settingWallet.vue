<template>
<div class="container">
	<h1>SETTINGS - Wallets</h1>	

	<div class="topBar">
		<b-btn v-b-modal.myModal class="btn btn-primary float-right" @click="clearForm">Add Wallet</b-btn>	
	</div>

	<!-- Modal -->
	<b-modal id="myModal" ref="modal" size="lg" :title="modalHeader" @hidden="onHidden">
		<b-alert :variant="status" dismissible :show="messageModalAlert">
			{{ message }}
		</b-alert>

    	<form>
			<b-form-group label-cols="2" id="inputNameGroup" label="Wallet Name" label-for="inputName" horizontal :invalid-feedback="feedbackName" :state="stateName">
        		<b-form-input id="inputName" size="sm" type="text" v-model="form.name" placeholder="Enter wallet name" :state="stateName"></b-form-input>
      		</b-form-group>
			<b-form-group label-cols="2" id="inputTypeGroup" label="Wallet Type" label-for="inputType" horizontal :invalid-feedback="feedbackType" :state="stateType" >
				<v-select id="inputType" size="sm" class="form-control" :options="classifications" label="name" placeholder="Choose Wallet Type" v-model="form.classification" v-bind:class="stateType" :state="stateType"></v-select>
			</b-form-group>
			<b-form-group label-cols="2" id="inputImageGroup" label="Image" label-for="dropzone" horizontal>
				<vue-dropzone 
					ref="myVueDropzone" 
					id="dropzone"
					v-on:vdropzone-removed-file="imageRemoved"  
					:options="dropzoneOptions">
				</vue-dropzone>
			</b-form-group>

			<!--
			<b-form-group label-cols="2" id="inputCoinGroup" label="Coin Supported" label-for="inputCoin" horizontal :invalid-feedback="feedbackCoin" :state="stateCoin">
				<v-select id="inputCoin" class="form-control" multiple size="sm" :options="currencies" label="ticker_default" placeholder="Choose Coin Supported" v-model="form.supportedCurrencies" :state="stateCoin"></v-select>
			</b-form-group>
			-->

			<b-form-group label-cols="2" id="inputAddressGroup" label="Coin Stored" label-for="inputAddressName" horizontal :invalid-feedback="feedbackCoin" :state="stateCoin">
				<div v-for="(a, index) in form.addresses" :key="index">
					<b-row class="addressRow" style="margin-bottom:5px;">
						<b-col style="max-width:130px; padding-right:10px; padding-left: 7px;">
							<b-form-select :id="'coin_' + index" v-model="a.currency_id" size="sm" class="inputCoin" :options="currencies" :text-field="'ticker_default'" :value-field="'id'" required :state="stateCoin" @change="changeCoin($event,index)">
								<template slot="first">
									<option :value="null" disabled>Select Coin</option>
								</template>
							</b-form-select>
						</b-col>
						<b-col style="padding-left:5px">
							<b-form-select :id="'address_' + index" v-model="a.address" size="sm" class="addressInput" required :state="stateCoin">
								<template slot="first">
									<option :value="null" disabled>Select Address</option>
								</template>
								<option v-for="f in fillAddress(a.currency_id)" :key="f.address" :value="f.address">{{ f.address }}</option>							
							</b-form-select>
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

		<b-alert :variant="status" dismissible :show="messageTableAlert">
			{{ message }}
		</b-alert>

		<vuetable ref="vuetable" api-url="wallet/show/vue-table" :css="css" :fields="fields" pagination-path="" @vuetable:pagination-data="onPaginationData" :http-fetch="myFetch">
			<template slot="actions" slot-scope="props">
				<a href="#" @click="editRow(props.rowData)" class="table-button h-100 d-inline-block rounded"><i class="far fa-eye"></i></a>
			</template>
		</vuetable>
		<vuetable-pagination ref="pagination" :css="css.pagination" @vuetable-pagination:change-page="onChangePage"
		></vuetable-pagination>
		
	</div>
</div>
</template>

<style>
.dz-preview .dz-progress {
    display: none
}
.vue-input-tag-wrapper .input-tag {
	background-color: #3e8acc !important;
	border-color: #3e8acc !important;
	color: #fff !important;
}
.vue-input-tag-wrapper .input-tag .remove {
	color: #fff !important;
}
.dropzone{
	padding:10px !important;
}
.dz-preview{
	width: 200px !important;
	height: 200px !important;
	border:1px solid #CCC;
}
.addressAdd{
	height:33px;
	padding-left:17px;
	padding-top:8px;
}
.addressInput{
	font-size:13px;
	padding: 4px 8px !important;
}
.inputCoin{
	margin:0px 8px;
}
</style>


<script>
import BootstrapStyle from '../bootstrap-css.js'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.css'
import BetterInputTag from 'better-vue-input-tag'

export default {
	components: {
		vueDropzone: vue2Dropzone,
		tagsInput: BetterInputTag
	},
	data() {
		return {
			dropzoneOptions: {
				url: 'https://httpbin.org/post',
				autoProcessQueue: false,
				uploadMultiple: true,
          		parallelUploads: 100,
				maxFilesize: 2,
				addRemoveLinks: true,
				thumbnailHeight: 200,
				thumbnailWidth: 200
			},
			modalHeader: 'Add Wallet',
			css: BootstrapStyle,
			status: null,
			message: '',
			messageModal: false,
			classifications: [],
			currencies: [],
			fields: [
				{
					name: '__slot:actions',
					dataClass: 'table-button-tdcontainer'
				},
				{
					name: 'name',
					title: 'Wallet Name',
					dataClass: 'font-weight-bold'
				},
				{
					name: 'wallet_classification.name',
					title: 'Type'
				},
				{
					name: 'wallet_currencies',
					title: 'Coin Stored',
					callback: 'splitCoins'
				}
			],
			errors: [],
			form: {
				name: null,
				classification: null,
				updatedId: null,
				files:[],
				deleted:[],
				supportedCurrencies:[],
				addresses: []
			}
		}
	},
	created() {

		this.axios.get('/classification')
		.then(response => {
			this.classifications = response.data.data
		}).catch(error => {
			this.status = error.response.data.status
			this.message = error.response.data.message
		})

		this.axios.get('/currency?limit=100')
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
		stateType() {
			return this.errors.classification  ? 'is-invalid' : 'normal'
		},
		feedbackType() {
			return this.errors.classification ? this.errors.classification[0] : ''
		},
		stateCoin() {
			return this.errors.classification  ? false : 'normal'
		},
		feedbackCoin() {
			return this.errors.classification ? this.errors.classification[0] : ''
		},
	},
	methods: {
		imageRemoved(file, error, xhr) {
			if(file.manuallyAdded == true) {
				this.form.deleted.push(file.name)
			}
		},
		vsuccess(file, response) {
			//console.log(file)
		},
		showSuccess(file) {
			//console.log('A file was successfully uploaded')
		},
		submitData() {
			this.$refs.createPost.processQueue()
		},
		onPaginationData (paginationData) {
      		this.$refs.pagination.setPaginationData(paginationData)
    	},
    	onChangePage (page) {
      		this.$refs.vuetable.changePage(page)
		},
		onHidden(evt){
			this.messageModal = false
			this.errors = []
			this.$refs.myVueDropzone.removeAllFiles()
		},
		myFetch(apiUrl, httpOptions) {
      		return this.axios.get(apiUrl, httpOptions)
		},
    	editRow(rowData){
			this.errors = []
			var self = this
			this.modalHeader = 'Edit Wallet',
			this.form.name = rowData.name
			this.form.classification = rowData.wallet_classification
			this.form.updateId = rowData.id
			this.form.deleted = []
			this.form.addresses = rowData.wallet_currencies

			if (rowData.images != null) {
				rowData.images.forEach(file => {

					var imageDataUrl = file.original_image;
					var mockFile = { size: "", name: file.filename }
					self.$refs.myVueDropzone.manuallyAddFile(mockFile, imageDataUrl)

				})
				
			}
			this.$refs.modal.show()
			this.status = null
		},
		myFetch(apiUrl, httpOptions) {
      		return this.axios.get(apiUrl, httpOptions)
    	},
		clearForm() {
			this.modalHeader = 'Add Wallet'
			this.form.name = null
			this.form.classification = null
			this.form.updateId = null
			this.form.files = []
			this.form.deleted = []
			this.form.addresses = []
			this.$refs.myVueDropzone.removeAllFiles()
			this.$refs.modal.hide()
			this.messageModal = false
			this.status = null
			this.errors = []
		},
		savePost(evt) {
			evt.preventDefault()

			this.$refs.myVueDropzone.getAcceptedFiles().forEach(file => {
				this.form.files.push(file.dataURL)
			})

			this.axios.post('/wallet', {
				name: this.form.name,
				classification: this.form.classification ? this.form.classification.id : '',
				supported_currencies: this.form.supportedCurrencies.map(a => a.id),
				images: this.form.files
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
			
			this.$refs.myVueDropzone.getAcceptedFiles().forEach(file => {
				this.form.files.push(file.dataURL)
			})
			
			this.axios.put('/wallet/' + this.form.updateId, {
				name: this.form.name,
				classification: this.form.classification ? this.form.classification.id : '',
				supported_currencies: this.form.supportedCurrencies.map(a => a.id),
				images: this.form.files,
				deleted_images: this.form.deleted
    		})
			.then(response => {
				if (response.data.status == 'success') {
					this.status = response.data.status
					this.message = response.data.message
					this.$refs.modal.hide()
					this.form.files = []
					this.$refs.vuetable.reload()
				}else {
					this.status = 'warning'
					this.message = 'Sorry, the system can not execute the command'
					this.$refs.modal.hide()
					this.form.files = []
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
				this.axios.delete('/wallet/'+ self.form.updateId)
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
				title: 'Delete Wallet',
				message: 'Wallet <strong>"' + this.form.name + '"</strong> will be delete',
				type: 'warning',
				useConfirmBtn: true,
    		onConfirm: confirmFn
			}
			this.$Simplert.open(obj)
		},
		splitCoins: function(value){
			var arrCoins = []
			value.map(function(v){
				arrCoins.some((c) => c == v.currency.ticker_default ) ?  null : arrCoins.push(v.currency.ticker_default)
			})
			return arrCoins.join(", ")
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
							that.form.addresses.push({ currency_id: null, address: null })
						}
					}else{
						
					}
				})

			}else{
				that.form.addresses.push({ currency_id: null, address: null })
			}
		},
		removeAddress(index) {
			this.form.addresses.splice(index, 1)
		},
		changeCoin(value,index){
			
			//this.addresses = this.currencies.filter(function(x){ return x.id == value; });
		},
		fillAddress(theId){
			return this.form.addresses.filter(function(x){ return x.currency_id == theId })
		}

	}
}
</script>