<template>
  <div id="app" class="container-fluid h-100">
    <!-- <router-link v-bind:to="'/'">Home</router-link> -->
    <!-- <router-link v-bind:to="'/about'">About</router-link> -->
    <!-- the router outlet, where all matched components would ber viewed -->
    <simplert></simplert>
    <transition name="fade">
    <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
}
</script>

<style>
#app{
	overflow:hidden;
}

.fade-enter-active, .fade-leave-active {
  transition-property: opacity;
  transition-duration: .25s;
}

.fade-enter-active {
  transition-delay: .25s;
}

.fade-enter, .fade-leave-active {
  opacity: 0
}

.simplert {
  z-index: 9999 !important;
}

.v-select .dropdown-toggle {
  border: 0px !important;
}

.v-select input[type=search], .v-select input[type=search]:focus {
  height: 30 !important;
}
</style>