<template>
  <div>
    <md-toolbar md-elevation="1" class="md-primary">
      <router-link to="/" style="flex: 1;">
        <h1 class="md-title">Product History</h1>
      </router-link>
      <router-link to="/records/add">
        <md-button class="md-icon-button md-raised md-accent">
          <md-icon>add</md-icon>
        </md-button>
      </router-link>
      <router-link to="/">
        <md-button class="md-icon-button md-raised md-accent">
          <md-icon>list</md-icon>
        </md-button>
      </router-link>
    </md-toolbar>
  </div>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>

<style scoped>
.md-button{
  margin: 0 5px !important;
}
</style>
