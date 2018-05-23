<template>

<div class="container">
	<h1>SETTINGS - Users </h1>	

	<div class="topBar">
		<b-btn v-b-modal.myModal class="btn btn-primary float-right" @click="clearForm">Add User</b-btn>	
	</div>

	<b-modal id="myModal" ref="modal" size="lg" :title="modalHeader" @hidden="onHidden">
		<b-alert :variant="status" dismissible :show="messageModalAlert">
			{{ message }}
		</b-alert>

    	<form>
			<b-form-group id="inputNameGroup" :label-cols="2" label="User Name" label-for="inputName" horizontal :invalid-feedback="feedbackName" :state="stateName">
        		<b-row><b-col sm="5"><b-form-input id="inputName" size="sm" type="text" v-model="form.name" placeholder="Enter Username" :state="stateName"></b-form-input></b-col></b-row>
      		</b-form-group>
			<b-form-group id="inputFirstNameGroup" :label-cols="2" label="First Name" label-for="inputFirstName" horizontal :invalid-feedback="feedbackFirstName" :state="stateFirstName">
				<b-row>
					<b-col sm="5"><b-form-input id="inputFirstName" size="sm" type="text" v-model="form.first_name" placeholder="Enter First Name" :state="stateFirstName"></b-form-input></b-col>
					<b-col sm="6">
						<b-form-group id="inputLastNameGroup" label="Last Name" label-for="inputLastName" horizontal :invalid-feedback="feedbackLastName" :state="stateLastName">
							<b-form-input id="inputLastName" size="sm" type="text" v-model="form.last_name" placeholder="Enter Last Name" :state="stateLastName"></b-form-input>
						</b-form-group>						
					</b-col>
					<b-col sm="1" style="padding-left:0;"><small class="form-text text-muted">Optional</small></b-col>
				</b-row>
      		</b-form-group>
			<b-form-group id="inputEmailGroup" :label-cols="2" label="Email Address" label-for="inputEmail" horizontal :invalid-feedback="feedbackEmail" :state="stateEmail">
        		<b-row><b-col sm="5"><b-form-input id="inputEmail" size="sm" type="email" v-model="form.contact_email" placeholder="Enter email address" :state="stateEmail"></b-form-input></b-col></b-row>
      		</b-form-group>
			<b-form-group id="inputPasswordGroup" :label-cols="2" :label="form.updateId != null ? 'New Password' : 'Password'" label-for="inputPassword" horizontal :invalid-feedback="feedbackPassword" :state="statePassword">
        		<b-row><b-col sm="5"><b-form-input id="inputPassword" size="sm" type="password" v-model="form.password" :placeholder="form.updateId != null ? 'Enter New Password' : 'Enter Password'" :state="statePassword"></b-form-input></b-col></b-row>
      		</b-form-group>
			<b-form-group id="inputPasswordVerifyGroup" :label-cols="2" label="Verify Password" label-for="inputPasswordVerify" horizontal :invalid-feedback="feedbackPasswordVerify" :state="statePasswordVerify">
        		<b-row><b-col sm="5"><b-form-input id="inputPasswordVerify" size="sm" type="password" v-model="form.password_verify" placeholder="Verify Password" :state="statePasswordVerify"></b-form-input></b-col></b-row>
      		</b-form-group>
			<b-form-group id="inputRoleGroup" :label-cols="2" label="User Role" label-for="inputRole" horizontal style="margin-bottom:6px !important;" >
				<b-row><b-col sm="5">
				<b-form-select v-model="form.role" id="inputRole" size="sm">
					<option :value="null">-- Please select role --</option>
					<option value="1">Administrator</option>
					<option value="2">General User</option>
				</b-form-select>
				</b-col></b-row>
			</b-form-group>
			<b-form-group id="inputPhotoGroup" :label-cols="2" label="Photo" label-for="inputPhoto" horizontal >
				<input type="hidden" id="inputPhoto" v-model="form.photo">
				<!--<avatar-upload img-url="/static/images/avatar.png"></avatar-upload>-->

				<div class="avatarInput">
					<div id="croppie"></div>
				</div>
				<div id="upload-wrapper">
					<div>
						<div class="input-file">
							<input type="file" id="upload-image" v-on:change="setUpFileUploader">
							<label class="" for="upload-image" class="btn-outline-secondary fileupload">
								<i class="fa fa-upload fa-fw"></i> Browse...
							</label>
						</div>
						<button class="btn btn-outline-secondary btn-sm" v-on:click="uploadfile">
							<i class="fa fa-save fa-fw"></i> Save
						</button>
						<b-form-text id="inputTickerHelp"><div style="width:280px; margin-top:10px;">Please Save after modifying the image</div></b-form-text>
					</div>
				</div>
				
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
		api-url="user/show/vue-table" 
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
		@vuetable-pagination:change-page="onChangePage">
		</vuetable-pagination>

	</div>
</div>

</template>

<script>
import BootstrapStyle from '../bootstrap-css.js'
import { Croppie } from 'croppie/croppie'
import 'croppie/croppie.css'

var isBase64 = require('is-base64');

export default {
	mounted(){
		this.$on('imageUploaded', function(imageData){
			this.image = imageData
			this.croppie.destroy()
			this.setUpCroppie(imageData);
		})
	},
	
	data() {
		return {
			modalHeader: 'Add User',
			css: BootstrapStyle,
			status: null,
			message: '',
			messageModal: true,
			fields: [
				{
					name: '__slot:actions',
					dataClass: 'table-button-tdcontainer'
				},				
				'username',
				{
					name: 'fullname',
					title: 'Real Name',
					dataClass: 'font-weight-bold'
				},
				{
					name: 'roles.0.description',
					title: 'Role'
				},
				{
					name: 'email',
					title: 'e-mail'
				}
			],
			errors: [],
			form: {
				name: null,
				first_name: null,
				last_name: null,
				contact_email: null,
				password: null,
				password_verify: null,
				updatedId: null,
				role: null,
				photo: null
			},
			//croppie
			croppie: null,
			image: null			

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
			return this.errors.username  ? false : 'normal'
		},
		feedbackName() {
			return this.errors.username ? this.errors.username[0] : ''
		},
		stateFirstName() {
			return this.errors.firstname  ? false : 'normal'
		},
		feedbackFirstName() {
			return this.errors.firstname ? this.errors.firstname[0] : ''
		},
		stateLastName() {
			return this.errors.lastname ? false : 'normal'
		},
		feedbackLastName() {
			return this.errors.lastname ? this.errors.lastname[0] : ''
		},
		stateEmail() {
			return this.errors.email ? false : 'normal'
		},
		feedbackEmail() {
			return this.errors.email ? this.errors.email[0] : ''
		},
		statePassword() {
			return this.errors.password ? false : 'normal'
		},
		feedbackPassword() {
			return this.errors.password ? this.errors.password[0] : ''
		},
		statePasswordVerify() {
			return this.errors.password ? false : 'normal'
		},
		feedbackPasswordVerify() {
			return this.errors.passwordVerify ? this.errors.passwordVerify[0] : ''
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
			this.modalHeader = 'Edit User',
			this.form.name = rowData.username
			this.form.first_name = rowData.firstname
			this.form.last_name = rowData.lastname
			this.form.contact_email = rowData.email
			this.form.password = null
			this.form.password_verify = null
			this.form.role = rowData.roles[0].id
			this.form.photo = null
			this.form.updateId = rowData.id
			this.$refs.modal.show()
			this.status = null

			if(this.croppie){this.croppie.destroy()}
			this.image = rowData.avatar ? rowData.avatar.original_image : '/static/images/avatar.png'
			this.setUpCroppie()
		},		
		clearForm() {

			if(this.croppie){this.croppie.destroy()}
			this.image = '/static/images/avatar.png'
			this.setUpCroppie()

			this.modalHeader = 'Add User',
			this.form.name = null
			this.form.first_name = null
			this.form.last_name = null
			this.form.contact_email = null
			this.form.password = null
			this.form.password_verify = null
			this.form.photo = null
			this.form.updateId = null
			this.$refs.modal.hide()
			this.messageModal = false
			this.status = null
			this.form.role = null
		},
		savePost(evt) {
			evt.preventDefault()
			this.axios.post('/user', {
				username: this.form.name,
				firstname: this.form.first_name,
				lastname: this.form.last_name,
				email: this.form.contact_email,
				password: this.form.password,
				password_confirmation: this.form.password_verify,
				roles: [{"role_id":this.form.role}],
				avatar: isBase64(this.image) ? this.image : null,
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
			this.axios.put('/user/' + this.form.updateId, {
				username: this.form.name,
				firstname: this.form.first_name,
				lastname: this.form.last_name,
				email: this.form.contact_email,
				password: this.form.password,
				password_confirmation: this.form.password_verify,
				roles: [{"role_id":this.form.role}],
				avatar: this.form.photo
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
				this.axios.delete('/user/'+ self.form.updateId)
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
				title: 'Delete User',
				message: 'User <strong>"' + this.form.name + '"</strong> will be deleted',
				type: 'warning',
				useConfirmBtn: true,
    		onConfirm: confirmFn
			}
			this.$Simplert.open(obj)
		},
		
		//Croppie

		setUpCroppie(){
			let el = document.getElementById('croppie')
			this.croppie = new Croppie(el,{
				viewport: {width: 120, height: 120, type: 'square'},
				boundary: {width: 140, height: 140},
			
			})
			this.croppie.bind({
				url: this.image
			})
		},
		setUpFileUploader(e){
			let files = e.target.files || e.dataTransfer.files
			if (!files.length){
				return
			}
			this.createImage(files[0])
		},
		createImage(file){
			var image = new Image()
			var reader = new FileReader()
			var vm = this
			
			reader.onload = (e) => {
				vm.image = e.target.result
				vm.$emit('imageUploaded', e.target.result)
			}

			reader.readAsDataURL(file)
		},
		uploadfile(e){
			this.croppie.result({
				type:'canvas',
				size:'viewport'
			}).then(response => {
				console.log(response)
				this.image = response
				this.form.photo = this.image
				event.preventDefault()
			})
		}
		


  	}

	
}

</script>
<style scoped>
.avatarInput{
  width:142px;
  float: left;
  margin-right:10px;
}
.btn-outline-secondary{
	display:block;
	font-size:13px;
	padding: 3px 7px;	
	border-radius: 0.15rem;
	width:96px;
	margin:4px;
}
.btn-outline-secondary.fileupload{
	margin:0px;
	text-align:center;
	padding:5px 6px;
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
</style>