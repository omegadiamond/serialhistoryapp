<template>
  <div id="app">
    <md-toolbar md-elevation="1" class="md-primary nav-toolbar">
      <h1 class="md-title" style="flex: 1;" @click="navAddRecord()">Product History App</h1>

      <md-button v-if="loggedIn" class="md-button md-raised md-accent nav-button" @click=navAddRecord() title="Add New Record">
        Get New Serial #
      </md-button>

      <md-field v-if="loggedIn" class="nav-search" >
        <md-input id="navSearch" v-model.trim="searchString" placeholder="Search" @input="onSearch()"></md-input>
      </md-field>

      <md-button v-if="loggedIn" class="md-icon-button md-raised md-accent nav-button" @click="navListRecords()" title="Search for a Record">
        <md-icon>search</md-icon>
      </md-button>
    </md-toolbar>

    <div class="container">
      <!--<router-view/>-->

      <login v-if="!loggedIn" v-on:onLogin="toLogin($event)"></login>

      <records-list
        v-if="loggedIn && searchMode"
        v-bind:searchString="searchString"
        v-on:addNew="navAddRecord($event)"
      ></records-list>

      <add-record
        v-if="loggedIn && !searchMode"
        v-bind:new-record="newRecord"
        v-on:listRecords="navListRecords()"
      ></add-record>

    </div>
  </div>
</template>

<script>

import Login from '@/components/Login'
import RecordsList from '@/components/records/RecordList'
import AddRecord from '@/components/records/AddRecord'
import axios from 'axios'
export default {
  name: 'App',
  components: {
    AddRecord,
    RecordsList,
    Login
  },
  data () {
    return {
      loggedIn: false,
      searchString: '',
      searchMode: false,
      newRecord: {}
    }
  },
  methods: {
    toLogin (loggedName) {
      this.loggedIn = true
      axios.defaults.headers.common['Authorization'] = loggedName
    },
    onSearch () {
      if (this.searchString) {
        this.searchMode = true
      }
    },
    navAddRecord (record) {
      if (record) {
        this.newRecord = record
      } else {
        this.newRecord = null
      }
      this.searchMode = false
      this.searchString = ''
    },
    navListRecords () {
      this.searchMode = true
      this.searchString = ''
    }
  }
}
</script>

<style>
.nav-search{
  max-width: 180px;
  margin-left: 5px;
  margin-right: 5px;
}
.nav-search input {
  background-color: #fff !important;
  padding: 0 10px !important;
  width: 100%;
  border-radius: 15px;
}
.nav-search:before, .nav-search:after{
  display: none;
}
/*.nav-search.md-focused .md-input{
  color: #ff5252 !important;
}*/

.container{
  max-width: 1500px;
  margin: 30px auto auto;
}

/* datapicker */
.datepicker > div {
  width: 100%;
}
.datepicker input {
  height: 32px;
  padding: 0;
  display: inline-block;
  flex: 1;
  border: 0 none;
  box-sizing: unset;
  -moz-box-flex: unset;
  -webkit-box-flex: unset;
  transition: .4s cubic-bezier(.25,.8,.25,1);
  transition-property: font-size,padding-top,color;
  font-family: inherit;
  font-size: 16px;
  line-height: 32px;
  width: calc(100% - 20px);
  background-color: transparent !important;
}
.datepicker .vdp-datepicker__clear-button{
  font-size: 22px;
  line-height: 22px;
}
</style>
