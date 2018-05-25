<template>

<div class="row h-100 appFrame">

<div class="header">
	<div id="headerLeft"><div v-on:click="collapse"><i class="fas fa-bars fa-lg"></i></div></div>
	<div class="headerRight">
		<div class="logoLeft"><img src="/static/images/logo.png"></div>
		<div class="logoRight">
			<div class="logoline1">Cryptocurrency</div>
			<div class="logoline2">Tracker and Fund Management Application</div>
		</div>
	</div>
</div>

<div class="user">
	<!--<div class="userBox" v-if="!$auth.check()">-->
	<div class="userBox">
		<div id="userBoxExpand">
			<div class="userBoxLeft">
				<div><img src="/static/images/avatar.png"></div>
			</div>
			<div class="userBoxRight">
				<router-link to="/currency"><i class="fas fa-user fa-fw"></i> User Profile</router-link>
				<a href="#" @click.prevent="$auth.logout()"><i class="fas fa-sign-out-alt fa-fw"></i> Logout</a>
			</div>
		</div>
		<div id="userBoxCollapse" style="display:none;">
			<div class="userBoxRight">
				<a href="#"><i class="fas fa-user fa-fw"></i></a>
				<a href="#" @click.prevent="$auth.logout()"><i class="fas fa-sign-out-alt fa-fw"></i></a>
			</div>
		</div>
	</div>
</div>

<div id="menuDiv" class="menu">
	<div class="menuBox">
	
	<ul class="list-group list-group-flush">
		<li class="list-group-item">
			<router-link to="/dashboard"><i class="fas fa-tachometer-alt fa-lg fa-fw"></i><span>Dashboard</span></router-link>
		</li>
		<li class="list-group-item">
			<a href="#"><i class="fas fa-balance-scale fa-lg fa-fw"></i><span>Balance &amp; Trades</span></a>
			<div class="subMenuDiv">
				<router-link to="/balancetrade">Balance &amp; Trades</router-link>
				<router-link to="/monthlysnapshot">Monthly Snapshot</router-link>
			</div>
		</li>
		<li class="list-group-item">
			<router-link to="/portfolio"><i class="fas fa-chart-line fa-lg fa-fw"></i><span>Portfolio</span></router-link>
		</li>
		<li class="list-group-item">
			<router-link to="/report"><i class="fas fa-chart-pie fa-lg fa-fw"></i><span>Report</span></router-link>
		</li>
		<li class="list-group-item">
			<a href="#"><i class="fas fa-cog fa-lg fa-fw"></i><span>Settings</span></a>
			<div class="subMenuDiv">
				<router-link to="/currency">Currencies</router-link>
				<router-link to="/wallet">Wallets</router-link>
				<router-link to="/bank">Bank Accounts</router-link>
				<router-link to="/exchange">Exchanges</router-link>
				<router-link v-if="$auth.user().roles[0].name === 'admin'" to="/user">Users</router-link>
			</div>
		</li>
	</ul>	
	
	</div>
</div>

<div id="contentDiv" class="content">
	<router-view></router-view>
</div>

</div>

</template>

<script>

var menuCollapsed = false;
export default {
	methods: {
		collapse() {
			if(!menuCollapsed){
				$(".menuBox span").hide();
				$(".list-group-item.active .subMenuDiv").hide();
				$("#userBoxExpand").hide();
				$("#headerLeft").addClass("headerLeftCollapse");
				$("#menuDiv").addClass("menuCollapse");
				$("#contentDiv").addClass("contentCollapse");
				$("#userBoxCollapse").show();

				menuCollapsed = true;
			}else{
				
				$("#userBoxExpand").show();
				$("#headerLeft").removeClass("headerLeftCollapse");
				$("#menuDiv").removeClass("menuCollapse");
				$("#contentDiv").removeClass("contentCollapse");
				$("#userBoxCollapse").hide();

				setTimeout(function(){ $(".menuBox span").show(); }, 400);
				setTimeout(function(){ $(".list-group-item.active .subMenuDiv").show(); }, 450);

				menuCollapsed = false;
			}
		}

	},
	mounted(){

		$( ".list-group-item:has(a.router-link-active)" ).addClass( "active activeOnLoad" );
		$( ".list-group-item:has(a.router-link-active)" ).prev().addClass( "previous" );
		
		$(".list-group-item > a").click(function(){
			
			if ($(this).siblings(".subMenuDiv").length) {
				
				$(".list-group-item:not(.active)").removeClass("activepeek");
				$(".list-group-item:not(.active) .subMenuDiv a").css("opacity","0");
				
				$(this).parent().addClass("activepeek");
				
				let i = 0;
				$(this).siblings(".subMenuDiv").children().each(function(i,el) {
					setTimeout(function(){
						$(el).css({'opacity':1});
					},50+(i*50));
					i++;
				});				
			}else{
				
				$(".list-group-item").removeClass("active");
				$(".list-group-item").removeClass("previous");
				$(".list-group-item").removeClass("activepeek");
				$(".list-group-item:not(.active) .subMenuDiv a").css("opacity","0");
				
				$(this).parent().addClass("active");
				$(this).parent().prev().addClass("previous");
				
			}
			
		});
		
		$(".list-group-item .subMenuDiv a").click(function(e) {
			e.stopPropagation();
			
			$(".list-group-item").removeClass("active");
			$(".list-group-item").removeClass("previous");
			$(".list-group-item").removeClass("activepeek");
			
			$(this).parent().parent().addClass("active");
			$(this).parent().parent().prev().addClass("previous");
		});		

	}
}
</script>

<style>
.appFrame{
	position:relative;
	overflow:auto;
	background-color:#e94f37;
}
.header{
	height:70px;
	width:100%;
	background-color:#f6f7eb;
}
#headerLeft{
	float:left;
	width:200px;
	height:22px;
	text-align:right;
	margin-top:24px;
	padding-right:25px;
	transition: 0.5s;
}
.headerRight{
	float:left;
	height:50px;
	margin-top:10px;
}
#headerLeft div{
	display:inline-block;
	padding:3px 6px 2px;
	border-radius: 2px;
	border:1px solid #f6f7eb;
	color:rgba(0,0,0,0.8);
}
#headerLeft div:hover{
	background-color:rgba(0,0,0,0.05);
	border:1px solid rgba(0,0,0,0.03);
	color:rgba(0,0,0,1);
	cursor:pointer;
}
.headerRight .logoLeft{
	float:left;
}
.headerRight .logoRight{
	float:left;
	font-family: 'Poppins';
	font-style: normal;
	font-weight: 300;
	line-height:8px;
	padding-top:15px;
	padding-left:15px;
}
.logoRight .logoline1{
	margin-bottom:10px;
	font-weight: 600;
}
.logoRight .logoline2{
	font-size:14px;
}
.user{
	position:absolute;
	width:100%;
	height:80px;
	top:70px;
	background-color:#f6f7eb;
}
.userBox{
	width:200px;
	padding:18px 10px 15px 15px;

	font-family: 'Poppins';
	font-style: normal;
	font-weight: 400;
	font-size:13px;
}
.userBox a{
	color:#333;
}
.userBox a:hover{
	color:#000;
	text-decoration:none;
}

.userBoxLeft{
	float:left;
}
.userBoxRight{
	float:left;
	padding:0px 10px;
}
.userBoxLeft img{
	border:3px solid #FFF;
	width:50px;
	height:50px;
}
.userBoxLeft div{
	display:inline-block;
	border:1px solid #e9eadf;
}
#userBoxCollapse{
	font-size:15px;
}
#userBoxCollapse .userBoxRight a:first-child{
	border-bottom-width:0px;
}

.userBoxRight a{
	display:block;
	padding:3px 0px;
}
.userBoxRight a:first-child { 
    border-bottom:1px solid #d0d2c9;
}
.menu{
	float:left;
	width:200px;
	transition: 0.5s;
}
.menuBox{
	margin-top:80px;
	font-family: 'Poppins';
	font-style: normal;
	font-weight: 400;
	font-size:13px;	
	padding:10px;
}
.menuBox a{
	color:rgba(255,255,255,0.8);
}
.menuBox a:hover{
	color:rgba(255,255,255,1);
	text-decoration:none;
}
.menuBox .list-group-item{
	color:#FFF;
	text-transform:uppercase;
	background-color:transparent;
	border:0px solid rgba(0, 0, 0, 0.125);
	border-bottom:1px solid #f08473;
	padding: 0;
}
.menuBox .list-group-item > a{
	display:block;
	padding:10px;
}
.menuBox i.fas{
	margin-right:10px;
}
.subMenuDiv{
	position:relative;
	top:-5px;
	margin-left:41px;
	padding-bottom:8px;
	display:none;
}
.menuBox .list-group-item.previous{
	border-bottom:1px solid rgba(0,0,0,0.1);
}
.menuBox .list-group-item.active:first-child{
	border-top:1px solid rgba(0,0,0,0.1);
}
.menuBox .list-group-item.active{
	background-color:rgba(0,0,0,0.1);
	border:1px solid rgba(0,0,0,0.05);
	border-bottom:1px solid #f08473 !important;
}
.menuBox .list-group-item.activepeek{
	
}
.menuBox .list-group-item.active .subMenuDiv, .menuBox .list-group-item.activepeek .subMenuDiv{
	display:block;
}
.subMenuDiv a{
	display:block;
	padding:2px 0px;
	text-transform:none;
	opacity:0;
    -webkit-transition: opacity 0.3s;
    transition: opacity 0.3s;
}
.menuBox .list-group-item.activeOnLoad .subMenuDiv a{
	opacity:1;
}
.menuBox .list-group-item.active > a:first-child{
	font-weight: 600;
	color:rgba(255,255,255,1);	
}


.subMenuDiv a.router-link-active{
	font-weight: 600;
	color:rgba(255,255,255,1);
}

.headerLeftCollapse {
	width:65px !important;
	padding-right:16px !important;
}
.menuCollapse{
	width:65px;
}
.contentCollapse{
	width:calc(100% - 95px);
}
</style>