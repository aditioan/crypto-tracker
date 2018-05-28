<template>	
<div class="container">

	<h1>SETTINGS - DEVELOPMENT TOOLS</h1>

    <div class="divContent">
        <b-btn v-b-modal.myModal class="btn btn-primary" @click="resetDatabase">Reset &amp; Reseed Database</b-btn>
    </div>

</div>
</template>


<script>
import BootstrapStyle from '../bootstrap-css.js'

export default {
    data() {
		return {
            status: null,
            message: null,
        }
    },
    methods: {
        resetDatabase(){
			this.axios.get('/development/reset-database')
			.then(response => {
				//this.totalTransaction = response.data.data;
			}).catch(error => {
				this.status = error.response.data.status
				this.message = error.response.data.message
			})
        }
    }
}
</script>