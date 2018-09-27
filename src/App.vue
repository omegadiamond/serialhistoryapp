<template>
  <div id="app">
    <app-header></app-header>
    <div class="container">
      <router-view/>
    </div>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader'

export default {
  name: 'App',
  components: {AppHeader}
}
</script>

<style>
.container{
  max-width: 1100px;
  margin: 30px auto auto;
}
</style>
