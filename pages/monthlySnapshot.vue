<template>

<div class="container">
	<h1>Monthly Snapshot</h1>

	<div class="row topBar">
		<div class="col-sm-2">
			<b-input-group id="dateTransaction">
				<b-input-group-text slot="append" style="padding: 3px 8px 4px;">
					<strong><i class="far fa-calendar-alt"></i></strong>
				</b-input-group-text>
				<date-picker name="date" id="dateTransactionMonth" ref="refMonth" v-model="form.theDate" :config="configList" @dp-change="changeMonth"></date-picker>
			</b-input-group>
		</div>
		<div class="col-sm-4" style="padding-left:0px;">
			<b-form-select id="inputSnapshot" class="form-control" style="height:33px;" size="sm" :options="snapshots" :text-field="'title'" :value-field="'id'" v-model="form.snapshotId" @change="changeSnapshot">
				<template slot="first">
					<option :value="null" disabled>-- Select Monthly Snapshot --</option>
				</template>
			</b-form-select>			
		</div>		
		<div class="col-sm-2" style="padding-left:0px;">
			<button type="button" class="btn btn-outline-secondary" style="width: 130px">
				Export to Excel
			</button>
		</div>
		<div class="col-sm-4">
			<b-btn v-b-modal.addSnapshot class="btn btn-primary float-right" style="margin-left: 10px;" @click="openModal" :disabled="defaultSnapshots && !form.snapshotId">
				Add Snapshot
			</b-btn>
			<b-btn class="btn btn-primary float-right" @click="activeSnapshot" :disabled="!form.snapshotId">Make Active</b-btn>
		</div>
	</div>

	<b-modal id="addSnapshot" ref="modal" size="md" :title="modalHeader" @hidden="onHidden">
		<b-alert :variant="status" dismissible :show="messageModal">
			{{ message }}
		</b-alert>

    	<form>
    		<b-form-group label-cols="3" id="inputMonthGroup" label="Month" label-for="inputName" horizontal>
				<b class="month">{{ details.theDateSnapshot }}</b>
      		</b-form-group>
			<b-form-group label-cols="3" id="inputNameGroup" label="Snapshot Name" label-for="inputName" horizontal>
				<b-form-input id="inputName" size="sm" type="text" v-model="formSnapshot.title" placeholder="Snapshot Name"></b-form-input>
      		</b-form-group>
			<b-form-group label-cols="3" id="inputSnapshotGroup" label="Based On" label-for="inputSnapshotGroup" horizontal>
				<b-form-select v-model="formSnapshot.based_on_snapshot_id" :options="snapshots" :text-field="'title'" :value-field="'id'" class="inputFrom" >           
                </b-form-select>
			</b-form-group>
			<b-form-group label-cols="3" id="inputCommentGroup" label="Comment" label-for="inputCommentGroup" horizontal>
				<b-form-textarea type="text" placeholder="Comment..." v-model="formSnapshot.comment" class="commentInput" :rows="3" :max-rows="6"></b-form-textarea>
			</b-form-group>
		</form>

		<div slot="modal-footer">
			<b-btn size="sm" variant="primary" @click="addSnapshot">Add Snapshot</b-btn>
    	</div>
  	</b-modal>

  	<b-modal id="priceOverride" ref="priceModal" size="md" :title="modalHeader" @hidden="onHidden">
		<b-alert :variant="status" dismissible :show="messageModal">
			{{ message }}
		</b-alert>

    	<form>
    		<b-form-group label-cols="3" id="inputMonthGroup" label="Month" label-for="inputName" horizontal>
				<b class="month">{{ details.theDateSnapshot }}</b>
      		</b-form-group>
      		<b-form-group label-cols="3" id="inputMonthGroup" label="Snapshot" label-for="inputName" horizontal>
				<span class="month">{{ details.theNameSnapshot }}</span>
      		</b-form-group>
      		<b-form-group label-cols="3" id="inputMonthGroup" label="Currency" label-for="inputName" horizontal>
				<span class="month">{{ details.theTickerSnapshot }} - {{ details.theCurrencySnapshot }}</span>
      		</b-form-group>
      		<div class="box-container">
      			<b-form-group label-cols="3" id="inputDateGroup" label="Date" label-for="inputName" horizontal>
      				<b-row>
						<b-col md="6">
			      			<b-input-group id="dateTransaction">
								<b-input-group-text slot="append" style="padding: 5px;">
									<strong><i class="far fa-calendar-alt"></i></strong>
								</b-input-group-text>
								<date-picker name="date" id="dateTransactionMonth" ref="refDate" v-model="details.date" :config="configModal"></date-picker>
							</b-input-group>
						</b-col>
					</b-row>
	      		</b-form-group>
	      		<table class="table b-table table-sm table-striped">
	      			<thead>
	      				<tr>
	      					<th>Exchange</th>
	      					<th>Price (USD)</th>
	      					<th>Volume (USD)</th>
	      				</tr>
	      			</thead>
	      			<tbody>
	      				<tr>
	      					<td>BitTrex</td>
	      					<td>{{exchanges.bittrex.price}}</td>
	      					<td>{{exchanges.bittrex.volume}}</td>
	      				</tr>
	      				<tr>
	      					<td>Poloniex</td>
	      					<td>{{exchanges.poloniex.price}}</td>
	      					<td>{{exchanges.poloniex.volume}}</td>
	      				</tr>
	      				<tr>
	      					<td>Bitfinex</td>
	      					<td>{{exchanges.bitfinex.price}}</td>
	      					<td>{{exchanges.bitfinex.volume}}</td>
	      				</tr>
	      			</tbody>
	      		</table>
      		</div>
      		<b-form-group label-cols="3" id="inputPriceGroup" label="Override" label-for="inputName" horizontal>
      			<b-row>
					<b-col md="6">
		      			<b-input-group id="dateTransaction">
							<b-input-group-text slot="append" style="padding: 5px;">
								<strong>USD</strong>
							</b-input-group-text>
							<vue-autonumeric v-model.number="formPrice.new_prices[0].price_in_usd" :options="{decimalPlaces: 2, minimumValue: '0' }" :placeholder="'Enter amount'" class="text-right form-control"></vue-autonumeric>
						</b-input-group>
					</b-col>
				</b-row>
      		</b-form-group>
		</form>

		<div slot="modal-footer">
			<b-btn size="sm" variant="primary" @click="overridePrice">Edit Price</b-btn>
    	</div>
  	</b-modal>	

	<div class="divContent">
        <b-card class="MSnapshot" no-body v-if="theSnapshot.length === 0">
		
        </b-card>
		<b-card class="MSnapshot" no-body v-else>
            <b-tabs card>
				<b-tab active>
					<template slot="title">Total</template>
					<table class="table table-striped">
						<thead>
							<tr>
								<th scope="col">Currency</th>
								<th scope="col">Type</th>
								<th scope="col">Amount</th>
								<th scope="col">Price in USD</th>
								<th scope="col">Value in AUD</th>
								<th scope="col">% of Total</th>
								<th scope="col">Price Override (USD)</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="s in snapshotTotal[0].snapshot_sub_details" :key="s.currency_id">
								<td>
									<div class="coin">
										<div class="currency-logo">
											<img v-bind:src="s.currency.logo?s.currency.logo.thumbnail:'/static/images/spacer.png'">
										</div>
										<span class="coin-ticker"> {{ s.currency.ticker_default }} </span>
										<span class="coin-name"> {{ s.currency.name }} </span>
									</div>
								</td>
								<td>
									<span class="classification">{{ s.currency.classification }}</span>
								</td>
								<td>
									{{ s.amount }}
								</td>
								<td>
									{{ s.price_in_usd }}
								</td>
								<td>
									{{ s.value_in_base }}
								</td>
								<td>
									{{ s.currency.classification == 'digital' ? s.percent_of_total : '---' }}
								</td>
								<td class="text-center">
									<i class="fa fa-edit" v-if="!defaultSnapshots" @click.stop="editPrice(s)"></i>
								</td>
							</tr>
						</tbody>
					</table>
				</b-tab>
				<b-tab>
					<template slot="title">Bank Account</template>
					<b-tabs pills card vertical>
						<div v-for="(item, index) in snapshotAccount" :key="'account' + index">
							<b-tab :title="item.storage_name" title-link-class="black-color">
								<table class="table table-striped">
									<thead>
										<tr>
											<th scope="col">Currency</th>
											<th scope="col">Type</th>
											<th scope="col">Amount</th>
											<th scope="col">Price in USD</th>
											<th scope="col">Value in AUD</th>
											<th scope="col">% of Total</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="s in item.snapshot_sub_details" :key="s.currency_id">
											<td>
												<div class="coin">
													<div class="currency-logo">
														<img v-bind:src="s.currency.logo?s.currency.logo.thumbnail:'/static/images/spacer.png'">
													</div>
													<span class="coin-ticker"> {{ s.currency.ticker_default }} </span>
													<span class="coin-name"> {{ s.currency.name }} </span>
												</div>
											</td>
											<td>
												<span class="classification">{{ s.currency.classification }}</span>
											</td>
											<td>
												{{ s.amount }}
											</td>
											<td>
												{{ s.price_in_usd }}
											</td>
											<td>
												{{ s.value_in_base }}
											</td>
											<td>
												{{ s.currency.classification == 'digital' ? s.percent_of_total : '---' }}
											</td>
										</tr>
									</tbody>
								</table>
							</b-tab>
						</div>
					</b-tabs>
				</b-tab>
				<b-tab>
					<template slot="title">Wallets</template>
					<b-tabs pills card vertical>
						<div v-for="(item, index) in snapshotWallet" :key="'account' + index">
							<b-tab :title="item.storage_name" title-link-class="black-color">
								<table class="table table-striped">
									<thead>
										<tr>
											<th scope="col">Currency</th>
											<th scope="col">Type</th>
											<th scope="col">Amount</th>
											<th scope="col">Price in USD</th>
											<th scope="col">Value in AUD</th>
											<th scope="col">% of Total</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="s in item.snapshot_sub_details" :key="s.currency_id">
											<td>
												<div class="coin">
													<div class="currency-logo">
														<img v-bind:src="s.currency.logo?s.currency.logo.thumbnail:'/static/images/spacer.png'">
													</div>
													<span class="coin-ticker"> {{ s.currency.ticker_default }} </span>
													<span class="coin-name"> {{ s.currency.name }} </span>
												</div>
											</td>
											<td>
												<span class="classification">{{ s.currency.classification }}</span>
											</td>
											<td>
												{{ s.amount }}
											</td>
											<td>
												{{ s.price_in_usd }}
											</td>
											<td>
												{{ s.value_in_base }}
											</td>
											<td>
												{{ s.currency.classification == 'digital' ? s.percent_of_total : '---' }}
											</td>
										</tr>
									</tbody>
								</table>
							</b-tab>
						</div>
					</b-tabs>
				</b-tab>
				<b-tab>
					<template slot="title">Exchange</template>
					<b-tabs pills card vertical>
						<div v-for="(item, index) in snapshotExchange" :key="'account' + index">
							<b-tab :title="item.storage_name" title-link-class="black-color">
								<table class="table table-striped">
									<thead>
										<tr>
											<th scope="col">Currency</th>
											<th scope="col">Type</th>
											<th scope="col">Amount</th>
											<th scope="col">Price in USD</th>
											<th scope="col">Value in AUD</th>
											<th scope="col">% of Total</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="s in item.snapshot_sub_details" :key="s.currency_id">
											<td>
												<div class="coin">
													<div class="currency-logo">
														<img v-bind:src="s.currency.logo?s.currency.logo.thumbnail:'/static/images/spacer.png'">
													</div>
													<span class="coin-ticker"> {{ s.currency.ticker_default }} </span>
													<span class="coin-name"> {{ s.currency.name }} </span>
												</div>
											</td>
											<td>
												<span class="classification">{{ s.currency.classification }}</span>
											</td>
											<td>
												{{ s.amount }}
											</td>
											<td>
												{{ s.price_in_usd }}
											</td>
											<td>
												{{ s.value_in_base }}
											</td>
											<td>
												{{ s.currency.classification == 'digital' ? s.percent_of_total : '---' }}
											</td>
										</tr>
									</tbody>
								</table>
							</b-tab>
						</div>
					</b-tabs>
				</b-tab>
            </b-tabs>
        </b-card>
	</div>
</div>

</template>

<style>
.topBar .btn{
	padding: 5px 14px;
}
.MSnapshot .table{
	margin-bottom:0px;
}
.MSnapshot .table th{
	border-top-width:0px;
}
.MSnapshot .card-body{
	padding:10px;
}
.box-container{
	background-color: #fff;
	padding: 5px;
}
.currency-logo{
	float:left;
	width:30px;
	height:22px;
}
.currency-logo img{
	width:23px;
	height:23px;
}
.coin{
	display:block;
	font-weight:bold;
	text-decoration:none;
	line-height: 0.8;
}
.coin-ticker{
	text-transform:uppercase;
	margin-bottom: 0rem;
	line-height: 0.8;
	font-weight: 700;
}
.coin-name{
	display:block;
	font-size:85%;
	padding-top:2px;
	margin-left:28px;
	font-weight: normal;
}
.classification{
	text-transform: capitalize;
}
.month{
	padding-top: 7px;
	display: block;
	position: relative;
}
</style>

<script>
import BootstrapStyle from '../components/bootstrap-css.js'
import moment from 'moment'
import VueAutonumeric from 'vue-autonumeric'

// Import date picker css
import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css'
import {AtomSpinner} from 'epic-spinners';

export default {
	data() {
		return {
			modalHeader: 'Add Monthly Snapshot',
			status: null,
			message: '',
			messageModal: false,
			snapshots: [],
			theSnapshot: [],
			snapshotWallet: [],
			snapshotAccount: [],
			snapshotExchange: [],
			snapshotTotal: [],
			defaultSnapshots: true,
			activePeriod: true,
			css: BootstrapStyle,
			errors: [],
			exchanges: {
				bitfinex: {
					price: null,
					volume: null,
				},
				poloniex: {
					price: null,
					volume: null,
				},
				bittrex: {
					price: null,
					volume: null,
				},
			},
			details: {
				theDateSnapshot: null,
				theNameSnapshot: null,
				theCurrencySnapshot: null,
				theTickerSnapshot: null,
				date: null,
			},
			form: {
				theDate: moment().format('DD MMMM YYYY'),
				snapshotId: null,
			},
			formSnapshot: {
				based_on_snapshot_id: null,
				title: null,
				comment: null,
			},
			formPrice: {
				new_prices: [
					{
						currency_id: null,
						price_in_usd: 0,
					},
				],
			},
			configList: {
		      	format: 'MMMM YYYY',
				viewMode: 'months',
			},
			configModal: {
		      	format: 'DD MMMM YYYY',
				viewMode: 'days',
			},
		}
	},
	components: {
      	AtomSpinner,
     	VueAutonumeric,
	},
	created(){
		this.axios.get('/snapshot')
		.then(response => {
			this.snapshots = response.data.data
			let active = this.snapshots.find(x => x.is_active == "1")
			active.title = active.title + " (Active)"
		}).catch(error => {
			console.log(error)
		})		
	},
	mounted(){

	},
	computed: {

	},
	watch: {
		'form.snapshotId' : function (val) {
			if (val) {
				let selectedSnapshots = this.snapshots.find(x => x.id == val )
				this.defaultSnapshots = selectedSnapshots.is_default == "1" ? true : false
			} else {
				this.defaultSnapshots = true
			}
		},
		'details.date' : function (val) {
			let apiBitfinex = 'https://min-api.cryptocompare.com/data/histoday?fsym=' + this.details.theTickerSnapshot + '&tsym=USD&toTs=' + moment(val, "DD MMMM YYYY").unix()+'&e=Bitfinex'
			let apiBitTrex = 'https://min-api.cryptocompare.com/data/histoday?fsym=' + this.details.theTickerSnapshot + '&tsym=USD&toTs=' + moment(val, "DD MMMM YYYY").unix()+'&e=BitTrex'
			let apiPoloniex = 'https://min-api.cryptocompare.com/data/histoday?fsym=' + this.details.theTickerSnapshot + '&tsym=USD&toTs=' + moment(val, "DD MMMM YYYY").unix()+'&e=Poloniex'
			
			let transferCompareBitfinex = this.axios.create({
                baseURL: apiBitfinex,
                timeout: 3000,
            });
            transferCompareBitfinex.get()
				.then(response => {
					console.log(response.data);
					this.exchanges.bitfinex.price = response.data.Data[30].close
					this.exchanges.bitfinex.volume = response.data.Data[30].volumeto
				}).catch(error => {
					console.log("Error getting data from API")
				})


			let transferComparePoloniex = this.axios.create({
                baseURL: apiPoloniex,
                timeout: 3000,
            });
            transferComparePoloniex.get()
				.then(response => {
					console.log(response.data);
					this.exchanges.poloniex.price = response.data.Data[30].close
					this.exchanges.poloniex.volume = response.data.Data[30].volumeto
				}).catch(error => {
					console.log("Error getting data from API")
				})


			let transferCompareBitTrex = this.axios.create({
                baseURL: apiBitTrex,
                timeout: 3000,
            });
            transferCompareBitTrex.get()
				.then(response => {
					console.log(response.data);
					this.exchanges.bittrex.price = response.data.Data[30].close
					this.exchanges.bittrex.volume = response.data.Data[30].volumeto
				}).catch(error => {
					console.log("Error getting data from API")
				})
		},
	},
	methods: {
		changeSnapshot(value){
			this.axios.get('/snapshot/'+value)
				.then(response => {
					this.theSnapshot = response.data.data
					//console.log(JSON.stringify(this.theSnapshot.snapshot_details))
					this.snapshotWallet = this.theSnapshot.snapshot_details.filter(function(x){return x.storageable_type == "App\\Models\\Wallet"});
					this.snapshotAccount = this.theSnapshot.snapshot_details.filter(function(x){return x.storageable_type == "App\\Models\\Account"});
					this.snapshotExchange = this.theSnapshot.snapshot_details.filter(function(x){return x.storageable_type == "App\\Models\\Exchange"});
					this.snapshotTotal = this.theSnapshot.snapshot_details.filter(function(x){return x.storage_name == "Total"});

					this.details.theNameSnapshot = response.data.data.title

					// console.log(JSON.stringify(this.snapshotTotal[0].snapshot_sub_details))
					
				}).catch(error => {
					alert("error")
					this.status = error.response.data.status
					this.message = error.response.data.message
				})
		},
		changeMonth(){
			this.axios.get('/snapshot?period='+this.form.theDate)
				.then(response => {
					this.snapshots = response.data.data
					this.form.snapshotId = null
					let active = this.snapshots.find(x => x.is_active == "1")
					active.title = active.title + " (Active)"
				}).catch(error => {
					this.status = error.response.data.status
					this.message = error.response.data.message
				})
		},
		openModal(){
			this.details.theDateSnapshot = moment(this.form.theDate).format('MMMM YYYY')
			this.clearForm();
		},
		closeModal(){
			this.clearForm()
			this.reload()
			this.$refs.modal.hide()
		},
		clearForm() {
			this.formSnapshot.based_on_snapshot_id = null
			this.formSnapshot.title = null
			this.formSnapshot.comment = null
			this.formPrice.new_prices[0].currency_id = null
			this.formPrice.new_prices[0].price_in_usd = 0
		},
		onHidden(evt){
			this.messageModal = false
			this.errors = []
		},
		editPrice(snapshot){
			this.modalHeader = "Edit Snapshot Price"
			this.details.theDateSnapshot = moment(this.form.theDate).format('MMMM YYYY')
			this.details.date = this.form.theDate
			this.details.theCurrencySnapshot = snapshot.currency.name
			this.details.theTickerSnapshot = snapshot.currency.ticker_default
			this.formPrice.new_prices[0].currency_id = snapshot.currency.id

			this.$refs.priceModal.show()
		},
		addSnapshot(evt){
			evt.preventDefault()
			this.messageModal = false

			// check if data is empty
            if (!(this.formSnapshot.title && this.formSnapshot.based_on_snapshot_id)) {
                this.messageModal = true
                this.status = 'danger'
                this.message = 'Please input a data first!'
                $('#addSnapshot').animate({scrollTop: 0}, 500, 'swing')
                return false
            }

			this.axios.post('/snapshot', this.formSnapshot)
			.then(response => {
				if (response.data.status == 'success') {
					this.status = response.data.status
					this.message = response.data.message
					this.snapshots.push(response.data.data)
					this.form.snapshotId = response.data.data.id
					this.changeSnapshot(response.data.data.id)
					this.clearForm();
					this.$refs.modal.hide()
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
    		})
		},
		overridePrice(evt){
			evt.preventDefault()
			this.messageModal = false

			// check if data is empty
            if (!(this.formPrice.new_prices[0].currency_id && this.formPrice.new_prices[0].price_in_usd)) {
                this.messageModal = true
                this.status = 'danger'
                this.message = 'Please input a data first!'
                $('#priceOverride').animate({scrollTop: 0}, 500, 'swing')
                return false
            }

			this.axios.put('/snapshot/'+this.form.snapshotId, this.formPrice)
			.then(response => {
				if (response.data.status == 'success') {
					this.status = response.data.status
					this.message = response.data.message
					this.changeSnapshot(this.form.snapshotId)
					this.clearForm();
					this.$refs.priceModal.hide()
				}else {
					this.status = 'warning'
					this.message = 'Sorry, the system can not execute the command'
					this.$refs.priceModal.hide()
					this.$refs.vuetable.reload()
				}
			})
			.catch(e => {
				this.messageModal = true
				this.status = 'danger'
				this.message = e.response.data.message
				this.errors = e.response.data.errors
    		})
		},
		activeSnapshot(){
			let self = this
			let confirmFn = function() {
				self.loading = true

				this.axios.put('/snapshot/'+self.form.snapshotId+'/set-active')
				.then(response => {
					// self.loading = false
					let activeOld = self.snapshots.find(x => x.is_active == "1")
					activeOld.is_active = "0"
					activeOld.title = activeOld.title.substring(0, activeOld.title.length - 9)

					let activeNew = self.snapshots.find(x => x.id == self.form.snapshotId)
					activeNew.is_active = "1"
					activeNew.title = activeNew.title + " (Active)"
				})
				.catch(error => {
					// self.loading = false
					console.log('Error has occured!')
				})
			}
			let obj = {
				title: 'Set Active Snapshot',
				message: "The current snapshot will be set as Active Snapshot. Are you sure?",
				type: 'warning',
				useConfirmBtn: true,
    			onConfirm: confirmFn
			}
			this.$Simplert.open(obj)
		},
	}
}
</script>