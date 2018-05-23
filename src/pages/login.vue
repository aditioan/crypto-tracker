<template>

<div class="row justify-content-center align-items-center h-100 loginPage">
	<div style="350px; position: relative; top:-30px;">
	
	<div class="headerLogo text-center">
		<div class="logo"><img src="/static/images/logo.png"></div>
		<div class="logoline1">Cryptocurrency</div>
		<div class="logoline2">Tracker and Fund Management Application</div>
	</div>
	
	<div class="card">
		<div class="card-header text-center">
			<h1>Log in</h1>
		</div>

		<div class="ldContainerCarousel">
		<div id="ldCarousel">
			<div class="ldChildCarousel">
				<form autocomplete="off" @submit.prevent="login" method="post">
					<div class="form-group">
						<label for="username">Username</label>
						<input type="text" class="form-control" id="username" placeholder="Username" v-model="username" required>
					</div>
					<div class="form-group">
						<label for="password">Password</label>
						<input type="password" class="form-control" id="password" placeholder="Password" v-model="password" required>
					</div>
					<div class="alert alert-danger" v-if="error">
						<div>There was an error, unable to sign in with given credentials</div>
					</div>			
					<div class="form-group text-center">
						<div style="margin:25px 20px 20px"><button class="btn btn-primary">Log In </button></div>
						<div><a href="#" @click.prevent="nextSlide">Forgot Password?</a></small></div>
					</div>
				</form>
			</div>
			<div class="ldChildCarousel">
				<form autocomplete="off" method="post" @submit.prevent="forgotPassword">
					<div class="form-group text-center">
						<h6 style="font-weight:bold; margin-bottom: 0.8rem;">Can't sign in?<br>Forget your password?</h6>
						<p style="line-height:19px;">
							Enter your registered email address below and we'll send you login instruction
						</p>
					</div>

					<b-alert :variant="status" :show="messageModalAlert">
						{{ message }}
					</b-alert>

					<div class="form-group">
						<label for="email">Registered E-mail</label>
						<input type="email" class="form-control" id="email" ref="forgotEmail" placeholder="E-mail">
					</div>

					<div class="form-group text-center">
						<div style="margin:25px 20px 20px">
							<b-btn variant="primary" @click="forgotPassword">Send</b-btn>
						</div>
						<div><a href="#" @click.prevent="prevSlide">Back</a></small></div>
					</div>
				</form>

			</div>
		</div>
		</div>





	</div>
	
	</div>
</div>

</template>

<script>
export default {
  methods: {
    handleSubmit() {
      this.$router.push({ path: '/appframe' })
    }
  }
}
</script>

<style>
.ldContainerCarousel{
	overflow:hidden;
	width:100%;
}
#ldCarousel{
	position:relative;
	width:200%;
	overflow:hidden;
}
.ldChildCarousel{
	float:left;
	width:50%;
	padding:30px;
}

.loginPage{
	background-image:url('/static/images/login_back.jpg');
	background-repeat:no-repeat;
	background-position:top left;
	background-size: cover;
}
.headerLogo{
	font-family: 'Poppins';
	font-style: normal;
	font-weight: 300;
	line-height:8px;
	margin-bottom:22px;
}
.headerLogo .logo{
	margin-bottom:20px;;
}
.headerLogo .logoline1{
	margin-bottom:10px;
	font-weight: 600;
}
.headerLogo .logoline2{
	font-size:14px;
}
.loginPage .card{
	box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
}
.loginPage .card-header h1{
	text-transform:uppercase;
	font-family:Poppins;
	font-weight:200;
	font-style: normal;
	font-size:25px;
	margin-bottom:0px;
}
.loginPage .card-header{
	padding: 1.25rem 1.25rem;
	border-bottom: 2px solid #3f88c5;
}
.loginPage .card-block{
	width:320px;
	height:380px;
	padding:30px;

}
.loginPage label{
	margin-bottom: .1rem;
	font-size:12px;
}
.loginPage .form-control{
	padding: 10px 12px 11px;
	font-size: 0.9rem;
}
.loginPage .btn{
	text-transform:uppercase;
	padding: 6px 44px;
}
.loginPage .alert{
	width:100%;
	padding: 0.5rem 1rem;
	margin-bottom: 0;
}
.loginPage .card{
	max-width:350px;
	overflow:hidden;
	
}
.loginPage .card .alert{
	font-size:13px;
}

</style>

<script>

export default {
	data() {
		return {
			username: null,
			password: null,
			status: null,
			message: '',
			email: null,
			error: false
		}
	},
	mounted() {

        // Can set query parameter here for auth redirect or just do it silently in login redirect.
	},
	computed: {
		messageModalAlert(){
			return (this.status != null) ? true : false
		},
	},
	methods: {
		login() {
			var app = this
			this.$auth.login({
				data: {
					username: app.username,
					password: app.password
				},
				error: function(resp) {
					app.error = true
				},
				rememberMe: true,
				redirect: '/',
				fetchUser: true,
			});
		},
		nextSlide(){
			document.getElementById("ldCarousel").style.left="-100%";
		},
		prevSlide(){
			document.getElementById("ldCarousel").style.left="0";
		},
		forgotPassword(evt) {
			evt.preventDefault()

			this.axios.post('/auth/reset-password', {
				email: this.$refs.forgotEmail.value
			})
			.then(response => {
				if (response.data.status == 'success') {
					this.status = response.data.status
					this.message = response.data.message
				}else {
					this.status = 'warning'
					this.message = 'Sorry, the system can not execute the command'
					this.$refs.modal.hide()
					this.$refs.vuetable.reload()
				}
			})
			.catch(e => {
				this.status = 'danger'
				this.message = e.response.data.message
				this.errors = e.response.data.errors
    		})
		}
	}
}
</script>
