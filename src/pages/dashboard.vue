<template>

<div class="container">
	<h1>Dashboard <sup>Mockup</sup></h1>	

	<div class="divContent">
		<img src="/static/images/mockup/dashboard.png">
	</div>
</div>

</template>

<script>
export default {
	beforeCreate: function() {
		$("body").addClass("contentDashboard");
	},
	beforeDestroy: function(){
		$("body").removeClass("contentDashboard");	
	}
}
</script>