// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//import the vue instance
import Vue from 'vue'
//import the App component
import App from './App'
//import the vue router
import VueRouter from 'vue-router'
//import axios
import axios from 'axios'
import VueAxios from 'vue-axios'
//import table component
import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePagination from 'vuetable-2/src/components/VuetablePagination'
import VuetablePaginationInfo from 'vuetable-2/src/components/VuetablePaginationInfo'
// import bootstrap vue
import BootstrapVue from 'bootstrap-vue'
import Simplert from 'vue2-simplert-plugin'
import vSelect from 'vue-select'
// Import datePicker component
import datePicker from 'vue-bootstrap-datetimepicker'
//async computed
import AsyncComputed from 'vue-async-computed'

//tell vue to use the router
Vue.use(VueRouter)
Vue.use(VueAxios, axios)
Vue.use(BootstrapVue)
Vue.use(Vuetable, VuetablePagination, VuetablePaginationInfo)
Vue.use(Simplert)
Vue.use(datePicker)
Vue.use(require('@websanova/vue-upload'))
Vue.use(AsyncComputed)

Vue.axios.defaults.baseURL = process.env.API_URL

//import components
import loginPage from './pages/login'
import appFrame from './pages/appframe'
import blankPage from './pages/blank'

//DASHBOARD page
import dashboardPage from './pages/dashboard'

//BALANCE & TRADES page
import balancetradePage from './pages/balanceTrade'
import monthlySnapshotPage from './pages/monthlySnapshot'

//PORTFOLIO page
import portfolioPage from './pages/portfolio'

//REPORT page
import reportPage from './pages/report'

//SETTINGS Pages
import settingCurrencyPage from './components/SettingComponents/settingCurrency'
import settingWalletPage from './components/SettingComponents/settingWallet'
import settingBankPage from './components/SettingComponents/settingBank'
import settingExchangePage from './components/SettingComponents/settingExchange'
import settingUserPage from './components/SettingComponents/settingUser'

// 404 page
import pageNotFound from './pages/404'


// tell component on vue global
Vue.component('vuetable', Vuetable)
Vue.component('vuetable-pagination', VuetablePagination)
Vue.component('vuetable-pagination-info', VuetablePaginationInfo)
Vue.component('v-select', vSelect)
Vue.component('page-not-found', {
  template: '<div class="not-found">Page not found!</div>'
})


//define your routes
const routes = [
	{ 
    path: '/', 
    component: appFrame, 
    meta: { auth: true },
    children:[
		{path: 'dashboard', component: dashboardPage },
		{path: 'balancetrade', component: balancetradePage },
		{path: 'monthlysnapshot', component: monthlySnapshotPage },
		{path: 'portfolio', component: portfolioPage },
		{path: 'report', component: reportPage },
		{path: 'currency', component: settingCurrencyPage },
		{path: 'wallet', component: settingWalletPage },
		{path: 'bank', component: settingBankPage },
		{path: 'exchange', component: settingExchangePage },
		{path: 'user', component: settingUserPage },
		{path: '', redirect: 'dashboard', meta: {auth: true} },
    ] 
  },
	{ path: '/login', name: 'login', component: loginPage, meta: { auth: false } },
  { path: '*', name: '404', component: pageNotFound},
]

// Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes, // short for routes: routes
  mode: 'history'
})

Vue.router = router

Vue.use(require('@websanova/vue-auth'), {
  auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
  authRedirect: { path: '/login' },
  notFoundRedirect: { path: '/dashboard' }
})

Vue.prototype.$eventHub = new Vue(); // Global event bus

//instatinat the vue instance
new Vue({
//define the selector for the root component
  el: '#app',
  //pass the template to the root component
  template: '<App/>',
  //declare components that the root component can access
  components: { 
    App,
  },
  //pass in the router to the Vue instance
  router
}).$mount('#app')//mount the router on the app