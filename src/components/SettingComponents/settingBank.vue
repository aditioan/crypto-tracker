<template>	
<div class="container">

	<h1>SETTINGS - BANK ACCOUNT</h1>

	<div class="topBar">
		<b-btn v-b-modal.myModal class="btn btn-primary float-right" @click="clearForm">Add Bank Account</b-btn>	
	</div>

	<!-- Modal -->
	<b-modal id="myModal" ref="modal" size="lg" :title="modalHeader" @hidden="onHidden">
		<b-alert :variant="status" dismissible :show="messageModalAlert">
			{{ message }}
		</b-alert>
    	<form>
			<b-form-group id="inputNameGroup" label="Bank Account Name" label-for="inputName" horizontal :invalid-feedback="feedbackName" :state="stateName">
        		<b-form-input id="inputName" size="sm" type="text" v-model="form.name" placeholder="Enter bank account name" :state="stateName"></b-form-input>
      		</b-form-group>
			<b-form-group id="inputNumberGroup" label="Bank Account Number" label-for="inputNumber" horizontal :invalid-feedback="feedbackNumber" :state="stateNumber">
				<b-form-input id="inputNumber" size="sm" type="text" v-model="form.number" placeholder="Enter account number" :state="stateNumber"></b-form-input>
			</b-form-group>
			<b-form-group id="inputContactGroup" label="Contact Name" label-for="inputContact" horizontal :invalid-feedback="feedbackContact" :state="stateContact">
				<b-form-input id="inputContact" size="sm" type="text" v-model="form.contact_name" placeholder="Enter contact name" :state="stateContact"></b-form-input>
			</b-form-group>
			<b-form-group id="inputEmailGroup" label="Email Address" label-for="inputEmail" horizontal :invalid-feedback="feedbackEmail" :state="stateEmail">
        		<b-form-input id="inputEmail" size="sm" type="email" v-model="form.contact_email" placeholder="Enter email address" :state="stateEmail"></b-form-input>
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

		<vuetable ref="vuetable"
			api-url="account/show/vue-table"
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
		<vuetable-pagination ref="pagination"
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
			modalHeader: 'Add Bank Account',
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
					name: 'bank_name',
					title: 'Account Name',
					dataClass: 'font-weight-bold'
				},
				{
					name: 'acc_number',
					title: 'Account Number'
				},
				{
					name: 'contact_name',
					title: 'Contact name'
				},
				{
					name: 'contact_email',
					title: 'Contact Email'
				}
			],
			errors: [],
			form: {
				name: null,
				number: null,
				contact_name: null,
				contact_email: null,
				updatedId: null
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
			return this.errors.bank_name  ? false : 'normal'
		},
		feedbackName() {
			return this.errors.bank_name ? this.errors.bank_name[0] : ''
		},
		stateNumber() {
			return this.errors.acc_number  ? false : 'normal'
		},
		feedbackNumber() {
			return this.errors.acc_number ? this.errors.acc_number[0] : ''
		},
		stateContact() {
			return this.errors.contact_name ? false : 'normal'
		},
		feedbackContact() {
			return this.errors.contact_name ? this.errors.contact_name[0] : ''
		},
		stateEmail() {
			return this.errors.contact_email ? false : 'normal'
		},
		feedbackEmail() {
			return this.errors.contact_email ? this.errors.contact_email[0] : ''
		}
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
		editRow(rowData){
			this.modalHeader = 'Edit Bank Account',
			this.form.name = rowData.bank_name
			this.form.number = rowData.acc_number
			this.form.contact_name = rowData.contact_name
			this.form.contact_email = rowData.contact_email
			this.form.updateId = rowData.id
			this.$refs.modal.show()
			this.status = null
		},
		clearForm() {
			this.modalHeader = 'Add Bank Account',
			this.form.name = null
			this.form.number = null
			this.form.contact_name = null
			this.form.contact_email = null
			this.form.updateId = null
			this.$refs.modal.hide()
			this.messageModal = false
			this.status = null
		},
		savePost(evt) {
			evt.preventDefault()
			this.axios.post('/account', {
				bank_name: this.form.name,
				acc_number: this.form.number,
				contact_name: this.form.contact_name,
				contact_email: this.form.contact_email
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
			this.axios.put('/account/' + this.form.updateId, {
				bank_name: this.form.name,
				acc_number: this.form.number,
				contact_name: this.form.contact_name,
				contact_email: this.form.contact_email
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
				this.axios.delete('/account/'+ self.form.updateId)
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
				title: 'Delete Bank Account',
				message: 'Bank Account <strong>"' + this.form.name + '"</strong> will be delete',
				type: 'warning',
				useConfirmBtn: true,
    		onConfirm: confirmFn
			}
			this.$Simplert.open(obj)
		}
	}
}
</script>