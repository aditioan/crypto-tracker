<template>

<div class="container">
	<h1>BALANCE &amp; TRADES</h1>	

	<div class="row topBar">
		<div class="col-sm-2">
			<b-input-group id="dateTransaction">
				<b-input-group-text slot="append" style="padding: 3px 8px 4px;">
					<strong><i class="far fa-calendar-alt"></i></strong>
				</b-input-group-text>
				<date-picker name="date" id="dateTransactionMonth" ref="refMonth" v-model="form.theDate" :config="configList" @dp-change="changeMonth"></date-picker>
			</b-input-group>
		</div>
		<div class="col-sm-2" style="padding-left:0px;">
			<button type="button" class="btn btn-outline-secondary">
				Export to Excel
			</button>
		</div>
		<div class="col-sm-8">
			<button type="button" class="btn btn-primary float-right" style="margin-left:10px;" @click="closePeriod" :disabled="!activePeriod">
				Close Accounting Period
			</button>
			<b-btn v-b-modal.myModal class="btn btn-primary float-right" @click="openModal" :disabled="!activePeriod">Add Transaction</b-btn>
		</div>
	</div>

	<!-- Modal -->
	<b-modal id="myModal" ref="modal" size="lg" @hide="clearForm">
		<div slot="modal-header">
			<h5 class="modal-title">{{ modalHeader }}</h5>
			<div class="row">
				<div class="col-sm-7">
					<div class="form-group row">
						<label class="col-sm-4 col-form-label">Transaction Type</label>
						<div class="col-sm-8">
							<b-form-select size="sm" v-if="form.updateId == null" v-model="currentComponent" :options="transactionsType" @change="changeTransactionType" />
							
							<label class="col-form-label" v-else><b>{{ form.transactionType }}</b></label>
						</div>
					</div>
				</div>
				<div class="col-sm-5">
					<div class="form-group row">
						<label for="inputPassword" class="col-sm-4 col-form-label text-right">{{ currentComponent == 'transactionOpening' ? 'Month' : 'Date' }}</label>
						<div class="col-sm-8">
							<b-input-group id="dateTransaction">
								<b-input-group-text slot="append">
									<strong><i class="far fa-calendar-alt"></i></strong>
								</b-input-group-text>
								<b-form-input type="text" v-if="(currentComponent == 'transactionHome') || (currentComponent == 'transactionOpening') || (currentComponent == 'Opening Balance') " :disabled="true" :value="theMontYear"></b-form-input>
								<date-picker name="date" id="dateTransactionInput" v-else ref="refDate" v-model="form.theDate" :config="configModal" :disabled="(currentComponent == 'transactionHome') || (currentComponent == 'transactionOpening')" @dp-change="changeDate"></date-picker>
							</b-input-group>
						</div>
					</div>
				</div>
			</div>
		</div>

		<b-alert :variant="status" dismissible :show="messageModalAlert">
			{{ message }}
		</b-alert>

		<div v-if="form.updateId == null">
			<transactionHome v-if="currentComponent == 'transactionHome'"></transactionHome>
			<transactionOpening ref="openingBalance" :walletsProps="wallets" :exchangesProps="exchanges" :bankAccountsProps="bankAccounts" v-if="currentComponent == 'transactionOpening'"></transactionOpening>
			<transactionFundReceived v-if="currentComponent == 'transactionFundReceived'" :baseCurrencyProp="baseCurrency" :currenciesProps="currencies" :bankAccountsProps="bankAccounts"></transactionFundReceived>
			<transactionFundRedemption v-if="currentComponent == 'transactionFundRedemption'" :baseCurrencyProp="baseCurrency" :currenciesProps="currencies" :bankAccountsProps="bankAccounts"></transactionFundRedemption>
			<transactionDeposit v-if="currentComponent == 'transactionDeposit'" :baseCurrencyProp="baseCurrency" :openingBalanceProp="openingBalanceTx" :walletsProp="wallets"  :currenciesProp="currencies" :exchangesProp="exchanges" :accountsProp="bankAccounts"></transactionDeposit>
			<transactionBought v-if="currentComponent == 'transactionBought'" :baseCurrencyProp="baseCurrency" :currenciesProp="currencies" :exchangesProp="exchanges" :accountsProp="bankAccounts"></transactionBought>
			<transactionICOFunding v-if="currentComponent == 'transactionICOFunding'" :baseCurrencyProp="baseCurrency" :currenciesProp="currencies" :accountsProp="bankAccounts"></transactionICOFunding>
			<transactionICORealization v-if="currentComponent == 'transactionICORealization'" :baseCurrencyProp="baseCurrency" :currenciesProp="currencies" :accountsProp="bankAccounts"></transactionICORealization>
			<transactionTransfered :exchangesProps="exchanges" :walletsProps="wallets" v-if="currentComponent == 'transactionTransfered'"></transactionTransfered>
			<transactionBankFee :baseCurrencyProp="baseCurrency" :currenciesProps="currencies" :bankAccountsProps="bankAccounts" v-if="currentComponent == 'transactionBankFee'"></transactionBankFee>
		</div>

		<div v-else>
			<transactionOpening ref="openingBalance" :walletsProps="wallets" :exchangesProps="exchanges" :bankAccountsProps="bankAccounts" :dataTransactionProps="dataTransaction" v-if="form.transactionType == 'Opening Balance'"></transactionOpening>
			<transactionFundReceived :baseCurrencyProp="baseCurrency" :currenciesProps="currencies" :bankAccountsProps="bankAccounts" :dataTransactionProps="dataTransaction" v-if="form.transactionType == 'Investor Fund Subscription'"></transactionFundReceived>
			<transactionFundRedemption :baseCurrencyProp="baseCurrency" :currenciesProps="currencies" :bankAccountsProps="bankAccounts" :dataTransactionProps="dataTransaction" v-if="form.transactionType == 'Investor Fund Redemption'"></transactionFundRedemption>
			<transactionDeposit :baseCurrencyProp="baseCurrency" :openingBalanceProp="openingBalanceTx" :dataTransactionProps="dataTransaction" :walletsProp="wallets"  :currenciesProp="currencies" :exchangesProp="exchanges" :accountsProp="bankAccounts" v-if="form.transactionType == 'Exchange Deposit'"></transactionDeposit>
			<transactionBought :baseCurrencyProp="baseCurrency" :currenciesProp="currencies" :exchangesProp="exchanges" :accountsProp="bankAccounts" :dataTransactionProps="dataTransaction" v-if="form.transactionType == 'Exchange Purchased'"></transactionBought>
			<transactionTransfered :exchangesProps="exchanges" :walletsProps="wallets" :dataTransactionProps="dataTransaction" v-if="form.transactionType == 'Transfered'"></transactionTransfered>
			<transactionBankFee :baseCurrencyProp="baseCurrency" :currenciesProps="currencies" :bankAccountsProps="bankAccounts" :dataTransactionProps="dataTransaction" v-if="form.transactionType == 'Bank Fees &amp; Interest'"></transactionBankFee>
		</div>


		<div slot="modal-footer">
			<button type="button" class="btn btn-secondary" data-dismiss="modal" @click="closeModal">Close</button>
			<b-btn size="sm" variant="danger" v-if="form.updateId != null" @click="deletePost(dataTransaction)">Delete</b-btn>
			<b-btn size="sm" variant="primary" v-if="form.updateId != null" @click="editPost">Edit Transaction</b-btn>
			<button type="button" class="btn btn-primary" v-if="form.updateId == null" @click="savePost">Save changes</button>
		</div>
  	</b-modal>
	<!-- Modal End-->

	<div v-if="loading" class="centerSpinner">
        <atom-spinner :animation-duration="1000" :size="100" :color="'#fd7e14'"  />
    </div>

	<div class="divContent" v-else>
		<div class="transactionList">
			<b-card no-body v-for="(t) in transactionList" :key="t.id">
				
				<template v-if="t.transactionable_type == 'opening_balances'">
					<div v-b-toggle="'collapse-'+t.id" class="btnHeader">
						<i class="fal"></i><span @click.stop="editRow(t, 'Opening Balance')" v-show="activePeriod"><i class="far fa-edit"></i></span>
						<div class="date">{{ t.transactionable.transaction_at | dateFormat }}</div>
						<div class="title">Opening Balance</div>
					</div>
					<b-collapse :id="'collapse-'+t.id">
						<div class="row rowContent" v-for="(balance, index) in t.transactionable.details">
							<div class="col-2 border-small"><b>{{ balance.container.name ? balance.container.name : balance.container.bank_name }}</b></div>
							<div class="col-10 border-small">
								<div class="row">
									<div class="col-4" v-for="(detail, index) in balance.sub_details">
										<div class="row itemBal">
											<div class="col-5">{{ detail.name }}</div>
											<div class="col-7 text-left">{{ detail.pivot.amount }}</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</b-collapse>
				</template>

				<template v-if="(t.transactionable_type=='investor_funds')&&(t.transactionable.type == '1')">
					<div v-b-toggle="'collapse-'+t.id" class="btnHeader">
						<i class="fal"></i> <span @click.stop="editRow(t, 'Investor Fund Subscription')" v-show="activePeriod"><i class="far fa-edit"></i></span>
						<div class="date">{{ t.transactionable.transaction_at | dateFormat }}</div>
						<div class="title">Investor Fund Subscription</div>
						<div class="credit"></div>
						<div class="debit">+{{ dispDec(t.transactionable.amount,t.transactionable.currency.decimal_displayed) }} {{ t.transactionable.currency.ticker_default }}</div>
					</div>
					<b-collapse :id="'collapse-'+t.id">
						<div class="row rowContent">
							<div class="col-2 font-weight-bold">To</div>
							<div class="col-10" v-if="t.transactionable.to.bank_name">{{ t.transactionable.to.bank_name }}</div>
							<div class="col-10" v-else-if="t.transactionable.to.name">{{ t.transactionable.to.name }}</div>

							<div class="col-2 font-weight-bold">Amount</div>
							<div class="col-10">{{ t.transactionable.currency.ticker_default }} {{ dispDec(t.transactionable.amount,t.transactionable.currency.decimal_displayed) }}</div>
							
							<div class="col-2 font-weight-bold">Price</div>
							<div class="col-10" v-if="t.transactionable.currency_id == t.transactionable.base_currency_id"><span class="font-italic">Amount is in base currency</span></div>
							<div class="col-10" v-else>{{ dispDec(t.transactionable.amount_in_base,t.transactionable.base_currency.decimal_displayed) }} {{ t.transactionable.base_currency.ticker_default }}/{{ t.transactionable.currency.ticker_default }}</div>
						</div>
					</b-collapse>
				</template>

				<template v-if="(t.transactionable_type=='investor_funds')&&(t.transactionable.type == '2')">
					<div v-b-toggle="'collapse-'+t.id" class="btnHeader">
						<i class="fal"></i> <span @click.stop="editRow(t, 'Investor Fund Redemption')" v-show="activePeriod"><i class="far fa-edit"></i></span>
						<div class="date">{{ t.transactionable.transaction_at | dateFormat }}</div>
						<div class="title">Investor Fund Redemption</div>
						<div class="credit">-{{ dispDec(t.transactionable.amount,t.transactionable.currency.decimal_displayed) }} {{ t.transactionable.currency.ticker_default }}</div>
						<div class="debit"></div>
					</div>
					<b-collapse :id="'collapse-'+t.id">
						<div class="row rowContent">
							<div class="col-2 font-weight-bold">From</div>
							<div class="col-10" v-if="t.transactionable.to.bank_name">{{ t.transactionable.to.bank_name }}</div>
							<div class="col-10" v-else-if="t.transactionable.to.name">{{ t.transactionable.to.name }}</div>

							<div class="col-2 font-weight-bold">Amount</div>
							<div class="col-10">{{ t.transactionable.currency.ticker_default }} {{ dispDec(t.transactionable.amount,t.transactionable.currency.decimal_displayed) }}</div>
							
							<div class="col-2 font-weight-bold">Price</div>
							<div class="col-10" v-if="t.transactionable.currency_id == t.transactionable.base_currency_id"><span class="font-italic">Amount is in base currency</span></div>
							<div class="col-10" v-else>{{ dispDec(t.transactionable.amount_in_base,t.transactionable.base_currency.decimal_displayed) }} {{ t.transactionable.base_currency.ticker_default }}/{{ t.transactionable.currency.ticker_default }}</div>
						</div>
					</b-collapse>
				</template>
				
				<template v-if="t.transactionable_type == 'deposits'">
					<div v-b-toggle="'collapse-'+t.id" class="btnHeader">
						<i class="fal"></i> <span @click.stop="editRow(t, 'Exchange Deposit')" v-show="activePeriod"><i class="far fa-edit"></i></span>
						<div class="date">{{ t.transactionable.transaction_at | dateFormat }}</div>
						<div class="title">Exchange Deposit to {{ t.transactionable.to_exchange.name }}</div>
						<div class="credit">-{{ dispDec(t.transactionable.withdraw_amount,t.transactionable.withdraw_currency.decimal_displayed) }} {{ t.transactionable.withdraw_currency.ticker_default }}</div>
						<div class="debit">+{{ dispDec(t.transactionable.total,t.transactionable.deposit_currency.decimal_displayed) }} {{ t.transactionable.deposit_currency.ticker_default }}</div>
					</div>
					<b-collapse :id="'collapse-'+t.id">
						<div class="row rowContent">
							<div class="col-2 font-weight-bold">To</div>
							<div class="col-10">{{ t.transactionable.to_exchange.name }}</div>

							<div class="col-2 font-weight-bold">Amount</div>
							<div class="col-10">{{ t.transactionable.deposit_currency.ticker_default }} {{ dispDec(t.transactionable.total,t.transactionable.deposit_currency.decimal_displayed) }}</div>
							
							<div class="col-2 font-weight-bold">Price</div>
							<div class="col-10" v-if="t.transactionable.currency_id == t.transactionable.base_currency_id"><span class="font-italic">Amount is in base currency</span></div>
							<div class="col-10" v-else>{{ dispDec(t.transactionable.deposit_in_base,t.transactionable.base_currency.decimal_displayed) }} {{ t.transactionable.base_currency.ticker_default }}/{{ t.transactionable.deposit_currency.ticker_default }}</div>
						</div>
					</b-collapse>
				</template>

				<template v-if="t.transactionable_type == 'buys'">
					<div v-b-toggle="'collapse-'+t.id" class="btnHeader">
						<i class="fal"></i> <span @click.stop="editRow(t, 'Exchange Purchased')" v-show="activePeriod"><i class="far fa-edit"></i></span>
						<div class="date">{{ t.transactionable.transaction_at | dateFormat }}</div>
						<div class="title">Exchange Purchased {{ t.transactionable.buy_currency.ticker_default }} @ {{ t.transactionable.exchange.name }}</div>
						<div class="credit">{{ dispDec(t.transactionable.buy_amount, t.transactionable.buy_currency.decimal_displayed) }} {{ t.transactionable.buy_currency.ticker_default }}</div>
						<div class="debit">- {{ dispDec(t.transactionable.fee_amount, t.transactionable.transfer_currency.decimal_displayed) }} {{ t.transactionable.transfer_currency.ticker_default }}</div>
					</div>
					<b-collapse :id="'collapse-'+t.id">
						<div class="row rowContent">
							<div class="col-2 font-weight-bold border-small">Bought</div>
							<div class="col-10 text-right border-small">{{ dispDec(t.transactionable.buy_amount, t.transactionable.buy_currency.decimal_displayed) }} {{ t.transactionable.buy_currency.ticker_default }}</div>

							<div class="col-2 font-weight-bold border-small">Value</div>
							<div class="col-10 text-right border-small">{{ dispDec(t.transactionable.total_paid, t.transactionable.transfer_currency.decimal_displayed) }} {{ t.transactionable.transfer_currency.ticker_default }}</div>
							
							<div class="col-2 font-weight-bold border-small">Price</div>
							<div class="col-10 text-right border-small">{{ dispDec(t.transactionable.transfer_amount, t.transactionable.transfer_currency.decimal_displayed) }} {{ t.transactionable.transfer_currency.ticker_default }}</div>
							
							<div class="col-2 font-weight-bold border-small">Exchange Fee</div>
							<div class="col-10 text-right border-small">{{ dispDec(t.transactionable.fee_amount, t.transactionable.transfer_currency.decimal_displayed) }} {{ t.transactionable.transfer_currency.ticker_default }}</div>
							
							<!-- <div class="col-2 font-weight-bold border-small">Transaction ID</div>
							<div class="col-10 text-right border-small"><b></b></div> -->
						</div>
					</b-collapse>			
				</template>				
				
				<template v-if="t.transactionable_type == 'transfers'">
					<div v-b-toggle="'collapse-'+t.id" class="btnHeader">
						<i class="fal"></i> <span @click.stop="editRow(t, 'Transfered')" v-show="activePeriod"><i class="far fa-edit"></i></span>
						<div class="date">{{ t.transactionable.transaction_at | dateFormat }}</div>
						<div class="title">Transfered {{ t.transactionable.currency.ticker_default }} from {{ transactionFromName(t.transactionable.from) }}</div>
						<div class="credit">{{ dispDec(t.transactionable.amount, t.transactionable.currency.decimal_displayed) }} {{ t.transactionable.currency.ticker_default }}</div>
						<div class="debit">- {{ dispDec(t.transactionable.fee_amount, t.transactionable.currency.decimal_displayed) }} {{ t.transactionable.currency.ticker_default }}</div>
					</div>
					<b-collapse :id="'collapse-'+t.id">
						<div class="row rowContent">
							<div class="col-2 font-weight-bold border-small">Amount</div>
							<div class="col-10 text-right border-small">{{ dispDec(t.transactionable.amount, t.transactionable.currency.decimal_displayed) }} {{ t.transactionable.currency.ticker_default }}</div>

							<div class="col-2 font-weight-bold border-small">Fee Total</div>
							<div class="col-10 text-right border-small">{{ dispDec(t.transactionable.fee_amount, t.transactionable.currency.decimal_displayed) }} {{ t.transactionable.currency.ticker_default }}</div>
							
							<div class="col-2 font-weight-bold border-small">To</div>
							<div class="col-10 text-right border-small"><b>{{ transactionToName(t.transactionable.to) }}</b> : {{ t.transactionable.address }}</div>
						</div>
					</b-collapse>			
				</template>

				<template v-if="t.transactionable_type == 'bank_interests'">
					<div v-b-toggle="'collapse-'+t.id" class="btnHeader">
						<i class="fal"></i> <span @click.stop="editRow(t, 'Bank Fees &amp; Interest')" v-show="activePeriod"><i class="far fa-edit"></i></span>
						<div class="date">{{ t.transactionable.transaction_at | dateFormat }}</div>
						<div class="title">Bank Fees &amp; Interest from {{ t.transactionable.account.bank_name }}</div>
					</div>
					<b-collapse :id="'collapse-'+t.id">
						<div class="row rowContent">
							<div class="col-2 font-weight-bold border-small">Bank</div>
							<div class="col-10 text-right border-small">{{ t.transactionable.account.bank_name }}</div>

							<div class="col-2 font-weight-bold border-small">Bank Fee</div>
							<div class="col-10 text-right border-small">{{ t.transactionable.fee_amount }} {{ t.transactionable.currency.ticker_default }}</div>
							
							<div class="col-2 font-weight-bold border-small">Interest Fee</div>
							<div class="col-10 text-right border-small">{{ t.transactionable.interest_percentage }} %</div>
						</div>
					</b-collapse>			
				</template>

			</b-card>

			<b-card class="total" v-if="totalTransaction.length>0">
				<div class="title total">Total</div>
				<div class="row total">

					<div class="col-4 total" v-for="(tot, index) in totalTransaction"><div class="row">
						<div class="col-4">
							<div class="tickerDefault">{{ tot.ticker_default }}</div>
							<div class="name">{{ tot.name }}</div>
						</div>
						<div class="col-8">{{ tot.amount }}</div>
					</div></div>

				</div>
			</b-card>

		</div>

	</div>
</div>

</template>

<style>
.modal-header{
	display: block !important;
	padding: 1rem 1rem 7px;
}

.modal-header .close{
	margin: -4.5rem -1rem -1rem auto !important;
}

.modal-header h5 {
	margin-bottom: 20px !important;
}

.transactionComponent{
	min-height:400px;
}

#dateTransaction .input-group-text{
	padding: 3px 8px;
}

#dateTransactionInput{
	padding: 3px 8px;
}

#transactionModal .modal-lg {
    max-width: 920px !important;
}

.topBar .btn{
	padding: 5px 14px;
}

.transactionList {
	border-top:1px solid rgba(0,0,0,0.1);
	padding-top:5px;
}

.transactionList .card{
	border-radius: 0;
	margin-bottom:4px;
}

.transactionList .btnHeader{
	display:block;
	width:100%;
	padding:5px 10px;
	border-bottom-width: 0;
	border-radius: 0;
	text-align:left;
	background-color:#f8f8f8;
	color:#212529;
	border-color:#e5e5e5;
	border-width:0px;
}

.transactionList .btnHeader.btn-secondary:focus, .transactionList .btnHeader.btn-secondary:active, .transactionList .btnHeader.btn-secondary:active:focus{
	outline: none !important;
	box-shadow: none !important;
}

.transactionList .btnHeader:active{
	outline:none;
}

.transactionList .btnHeader .fal{
	display:block;
	float:left;
	font-size:28px;
	margin-right:10px;
	width:20px;
	text-align: center;
}

.transactionList .btnHeader .fal:before{
	content: "\f107";
}
.transactionList .btnHeader.collapsed .fal:before{
	content: "\f105";
}

.transactionList .fa-edit{
	display:block;
	float:left;
	font-size:16px;
	margin-right:20px;
	color:#212529;
	margin-top:5px;
	cursor: pointer;
}

.transactionList .btnHeader div{
	float:left;
	margin:4px 20px;
}

.transactionList .btnHeader div.date{
	width:80px;
}

.transactionList .card.total .card-body{
	padding:0px;
}

.transactionList div.title, .transactionList .btnHeader div.title{
	width:300px;
	font-weight:bold;
}

.transactionList div.title.total{
	padding:8px 20px;
	width:100% !important;
	background-color:#f8f8f8;
}

.transactionList div.row.total{
	padding:8px 22px;
}

.transactionList div.row.total .total{
	border-right:4px solid #FFF;
	background-color:#f3f3f3;
	padding-right:0;
	padding-left:0
}


.transactionList div.row.total .total .col-4{
	padding:5px;
}

.transactionList div.row.total .total .col-4 .tickerDefault{
	font-weight:bold;
}

.transactionList div.row.total .total .col-4 .name{
	font-size:10px;
	line-height:5px;
}

.transactionList div.row.total .total .col-8{
	padding:10px;
	text-align:right;
}

.transactionList div.row.total :nth-child(6n), .transactionList div.row.total :nth-child(6n-1), .transactionList div.row.total :nth-child(6n-2){
	background-color:#e7e7e7;
}

.transactionList div.row.total .total .row{
	margin:0px 2px;
	padding:0px 2px;
}
.btn-outline-secondary{
	margin:0px 4px !important;
	width:inherit !important;
	padding:5px 4px 6px !important;
}
.rowContent{
	padding: 10px;
	padding-left:218px !important;
	padding-right:30px;
}
.itemBal .col-5{
	font-weight:bold;
}
.itemBal .col-7{
	text-align:right;
}
.credit, .debit{
	float:right !important;
	width:180px;
	margin:4px 10px !important;
	text-align:right;
}
.credit div, .debit div{
	padding-left:0 !important;
	padding-right:0 !important;
	margin:0px !important;
}
.border-small {
	border: 1px solid #DADFE1;
}
option{
	color:#000;
}
option:disabled{
	color:rgba(0,0,0,0.5);
}

</style>

<script>
import BootstrapStyle from '../components/bootstrap-css.js'

import transactionOpening from '../components/TransactionComponents/transactionOpening'
import transactionFundReceived from '../components/TransactionComponents/transactionFundReceived'
import transactionFundRedemption from '../components/TransactionComponents/transactionFundRedemption'
import transactionDeposit from '../components/TransactionComponents/transactionDeposit'
import transactionBought from '../components/TransactionComponents/transactionBought'
import transactionOTC from '../components/TransactionComponents/transactionOTC'
import transactionICOFunding from '../components/TransactionComponents/transactionICOFunding'
import transactionICORealization from '../components/TransactionComponents/transactionICORealization'
import transactionTransfered from '../components/TransactionComponents/transactionTransfered'
import transactionBankFee from '../components/TransactionComponents/transactionBankFee'
import moment from 'moment'

// Import date picker css
import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css'
import index from 'vue';
import {AtomSpinner} from 'epic-spinners';

export default {
	data() {
		return {
			modalHeader: 'Add Transaction',
			css: BootstrapStyle,
			status: null,
			loading: false,
			activePeriod: true,
			message: '',
			messageModal: true,
			currentComponent: 'transactionHome',
			transactionsType: [
				{ value: 'transactionHome', text: '-- Select Transaction --' },
				{ value: 'transactionOpening', text: 'Opening Balance', disabled: false },
				{ value: 'transactionFundReceived', text: 'Investor Fund Subscribe', disabled: true },
				{ value: 'transactionFundRedemption', text: 'Investor Fund Redemption', disabled: true },
				{ value: 'transactionDeposit', text: 'Exchange Deposit', disabled: true },
				{ value: 'transactionBought', text: 'Exchange Purchased', disabled: true },
				{ value: 'transactionOTC', text: 'Over The Counter', disabled: true },
				{ value: 'transactionICOFunding', text: 'ICO Funding', disabled: true },
				{ value: 'transactionICORealization', text: 'ICO Realization', disabled: true },
				{ value: 'transactionTransfered', text: 'Wallet Transfer', disabled: true },
				{ value: 'transactionBankFee', text: 'Bank Fees &amp; Interest', disabled: true },
			],
			form: {
				theDate: moment().format('DD MMMM YYYY'),
				updateId: null,
				transactionType: '',
			},
			configList: {
		      	format: 'MMMM YYYY',
				viewMode: 'months',
			},
			configModal: {
		      	format: 'DD MMMM YYYY',
				viewMode: 'days',
			},
		    dataTransaction: [],
			wallets: [],
			exchanges: [],
			bankAccounts: [],
			currencies: [],
			baseCurrency: [],
			transactionList: [],
			fundReceivedTheData: [],
			openingBalanceTx: [],
			totalTransaction: [],
		}
	},

	components: {
		transactionHome:{
			template:'<div class="transactionContainer"></div>'
		},
		transactionOpening,
		transactionFundReceived,
		transactionFundRedemption,
		transactionDeposit,
		transactionBought,
		transactionOTC,
		transactionICOFunding,
		transactionICORealization,
		transactionTransfered,
		transactionBankFee,
      	AtomSpinner,
	},

    created() {

		this.axios.get('/currency?limit=1000')
		.then(response => {
			this.currencies = response.data.data
		}).catch(error => {
			console.log(error)
		})
	
		this.axios.get('/wallet?limit=1000')
		.then(response => {
			this.wallets = response.data.data
		}).catch(error => {
			console.log(error)
		})

		this.axios.get('/exchange?limit=1000')
		.then(response => {
			this.exchanges = response.data.data
		}).catch(error => {
			console.log(error)
		})

		this.axios.get('/account?limit=1000')
		.then(response => {
			this.bankAccounts = response.data.data
		}).catch(error => {
			console.log(error)
		})

        this.axios.get('/currency/show/base-currency')
        .then(response => {
            this.baseCurrency = response.data.data;
        }).catch(error => {
            this.status = error.response.data.status
            this.message = error.response.data.message
		})
		
	},

	mounted() {
		//this.$events.listen('load-investorFunds', paramNya => alert(paramNya));
		this.loadTransaction(this.form.theDate)
		//this.theConfig = this.configMonth
		this.axios.get('/closing-period/check?date='+this.form.theDate)
			.then(response => {
				this.activePeriod = !response.data.data.closed
			}).catch(error => {
				this.status = error.response.data.status
				this.message = error.response.data.message
			})
	},

	computed: {
		messageModalAlert(){
			return (this.status == 'danger' && this.messageModal == true) ? true : false
		},
		theMontYear(){
			return moment(this.form.theDate)._isValid ? moment(this.form.theDate).format('MMMM YYYY'): this.form.theDate
		}
	},

	methods: {
		loadTransaction(paramMonth){

			this.axios.get('/transaction?transaction_at='+paramMonth)
			.then(response => {
				this.transactionList = response.data.data
				this.transactionsType[1].disabled = false

				let arrayOpeningBalance = this.transactionList.find(x => x.transactionable_type == "opening_balances" )
				if(arrayOpeningBalance){
					/*
					let openingBalanceDate = new Date(arrayOpeningBalance.transaction_at)
					let currentDate = new Date(this.form.theDate)
					if (openingBalanceDate.getMonth() == currentDate.getMonth()) {
						this.transactionsType[0].disabled = false
						this.transactionsType[1].disabled = true
						this.transactionsType[2].disabled = false
						this.transactionsType[3].disabled = false
						this.transactionsType[4].disabled = false
						this.transactionsType[5].disabled = false
						this.transactionsType[6].disabled = false
						this.transactionsType[7].disabled = false
						this.transactionsType[8].disabled = false
						this.transactionsType[9].disabled = false
					}
					*/

					this.transactionsType[0].disabled = false
					this.transactionsType[1].disabled = true
					this.transactionsType[2].disabled = false
					this.transactionsType[3].disabled = false
					this.transactionsType[4].disabled = false
					this.transactionsType[5].disabled = false
					this.transactionsType[6].disabled = false
					this.transactionsType[7].disabled = false
					this.transactionsType[8].disabled = false
					this.transactionsType[9].disabled = false					

					this.openingBalanceTx = arrayOpeningBalance.transactionable
				}else{

					this.transactionsType[0].disabled = true
					this.transactionsType[1].disabled = false
					this.transactionsType[2].disabled = true
					this.transactionsType[3].disabled = true
					this.transactionsType[4].disabled = true
					this.transactionsType[5].disabled = true
					this.transactionsType[6].disabled = true
					this.transactionsType[7].disabled = true
					this.transactionsType[8].disabled = true
					this.transactionsType[9].disabled = true

				}

			}).catch(error => {
				this.status = error.response.data.status
				this.message = error.response.data.message
			})

			this.axios.get('/transaction/show/summary?transaction_at='+paramMonth)
			.then(response => {
				this.totalTransaction = response.data.data;
			}).catch(error => {
				this.status = error.response.data.status
				this.message = error.response.data.message
			})

		},

		reload(){
			this.transactionList = []
			this.loadTransaction(this.form.theDate)

			if(moment(this.form.theDate).isSame(new Date(), 'month')){
				//alert("current month")
			}else{
				//alert("what?")
			}

		},

		changeTransactionType(value) {
			this.currentComponent = value

			let theMinDate = moment(this.form.theDate)._isValid ? moment(this.form.theDate).startOf("month") : moment("1 "+this.form.theDate).startOf("month")
			let theMaxDate = moment(this.form.theDate)._isValid ? moment(this.form.theDate).endOf("month") : moment("1 "+this.form.theDate).endOf("month")

			if( (value == 'transactionHome') || (value == 'transactionOpening') ){
				this.configModal = {format: 'MMMM YYYY',viewMode: 'months', minDate: theMinDate, maxDate: theMaxDate}
			}else{
				this.configModal = {format: 'DD MMMM YYYY', viewMode: 'days', minDate: theMinDate, maxDate: theMaxDate}
			}
		},

		onHidden(evt){
			this.messageModal = false
			this.errors = []
		},
		clearForm() {
			this.modalHeader = 'Add Transaction'
			this.currentComponent = 'transactionHome'
			//this.$refs.modal.hide()
			this.messageModal = false
			this.status = null
			this.form.updateId = null
			this.form.transactionType = ''
		},
		changeTo(that){
			this.current = that
		},
		openModal(){
			this.clearForm();
		},
		closeModal(){
			this.clearForm()
			this.reload()
			this.$refs.modal.hide()
		},
		savePost(evt){
			evt.preventDefault()
			this.$eventHub.$emit('eventSaveTransaction');
		},
		editPost(evt){
			evt.preventDefault()
			this.$eventHub.$emit('eventEditTransaction');
		},
		changeMonth(){
			this.loadTransaction(this.form.theDate)
			this.axios.get('/closing-period/check?date='+this.form.theDate)
				.then(response => {
					console.log(response.data)
					this.activePeriod = !response.data.data.closed
				}).catch(error => {
					this.status = error.response.data.status
					this.message = error.response.data.message
				})
		},
		changeDate(){
			this.$eventHub.$emit('eventDateChange');
		},
		deletePost(data){
			let self = this
			let confirmFn = function() {
				let deleteApi = ''
				switch (data.transactionable_type) {
					case 'opening_balances':
                        deleteApi = '/opening-balance/'
                        break;
                    case 'investor_funds':
                        deleteApi = '/investor-fund/'
                        break;
                    case 'deposits':
                        deleteApi = '/deposit/'
                        break;
                    case 'buys':
                    	deleteApi = '/bought/'
                    	break;
                    default:
                        deleteApi = '/transfer/'
				}

				this.axios.delete(deleteApi + self.form.updateId)
				.then(response => {
					self.status = response.data.status
					self.message = response.data.message
					self.$refs.modal.hide()
					self.closeModal()
				})
				.catch(error => {
					self.messageModal = true
					self.status = error.response.data.status
					self.message = error.response.data.message
				})
			}
			let obj = {
				title: 'Delete Transaction',
				message: 'Data <strong>"' + this.form.transactionType + '"</strong> will be deleted',
				type: 'warning',
				useConfirmBtn: true,
    			onConfirm: confirmFn
			}
			this.$Simplert.open(obj)
		},
		closePeriod(){
			let self = this
			let confirmFn = function() {
				self.loading = true

				// sent data to API
				let dateObj = new Date(self.form.theDate)
				dateObj.setDate(dateObj.getDate()+1)

				this.axios.post('/closing-period', {period: dateObj})
				.then(response => {
					self.loading = false
					self.activePeriod = false
					console.log('Accounting peried has been closed!')
				})
				.catch(error => {
					self.loading = false
					console.log('Error has occured!')
				})
			}
			let obj = {
				title: 'Accounting period will be closed!',
				message: "The transaction data for this month can't be modified after accounting period is closed. Are you sure?",
				type: 'warning',
				useConfirmBtn: true,
    			onConfirm: confirmFn
			}
			this.$Simplert.open(obj)
		},
		formatMoney(n, c, d, t){

			let s = n < 0 ? "-" : ""
			let i,j

			c = isNaN(c = Math.abs(c)) ? 2 : c, 
			d = d == undefined ? "." : d, 
			t = t == undefined ? "," : t,  
			i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
			j = (j = i.length) > 3 ? j % 3 : 0;
		return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
		},
		dispDec(value,decimal){
			return this.formatMoney(value,decimal)
		},
		editRow(transaction, type){
			this.clearForm()
			this.form.updateId = transaction.transactionable.id
			this.form.transactionType = type
			this.currentComponent = type
			this.dataTransaction = transaction
			this.modalHeader = 'Edit Transaction'

			let theMinDate = moment(this.form.theDate)._isValid ? moment(this.form.theDate).startOf("month") : moment("1 "+this.form.theDate).startOf("month")
			let theMaxDate = moment(this.form.theDate)._isValid ? moment(this.form.theDate).endOf("month") : moment("1 "+this.form.theDate).endOf("month")

			if( transaction.transactionable_type == 'Opening Balance' ){
				this.configModal = {format: 'MMMM YYYY',viewMode: 'months', minDate: theMinDate, maxDate: theMaxDate}
			}else{
				this.configModal = {format: 'DD MMMM YYYY',viewMode: 'days', minDate: theMinDate, maxDate: theMaxDate}
			}

			this.$refs.modal.show()
		},
		transactionFromName(from){
			return (from) ? from.name : 'Outside'
		},
		transactionToName(to){
			return (to) ? to.name : 'Outside'
		}

	},
	filters: {
		dateFormat: function (value) {
			if (!value) return ''
			value = value.toString()
			return moment(value).format('DD MMMM YYYY')
		}
	},
    beforeDestroy() {
        this.$eventHub.$off('eventSaveTransaction');
	}

}
</script>