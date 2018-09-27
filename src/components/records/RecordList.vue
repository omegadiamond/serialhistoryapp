<template>
  <div>
    <md-table md-card>
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">Records</h1>
        </div>
        <div class="md-toolbar-section-start"></div>
        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="Search" maxlength="20" v-model="search" @input="searchRecord()"/>
        </md-field>
      </md-table-toolbar>

      <md-table-row>
        <md-table-head>Serial #</md-table-head>
        <md-table-head>Product Code</md-table-head>
        <md-table-head>Sales Order #</md-table-head>
        <md-table-head>Customer ID</md-table-head>
        <md-table-head>Description</md-table-head>
      </md-table-row>

      <md-table-row v-for="(record, index) in records" :key="index">
        <md-table-cell>{{ record.serial_number }}</md-table-cell>
        <md-table-cell>{{ record.product_code }}</md-table-cell>
        <md-table-cell>{{ record.sales_order }}</md-table-cell>
        <md-table-cell>{{ record.customer_id }}</md-table-cell>
        <md-table-cell>{{ record.description }}</md-table-cell>
      </md-table-row>
    </md-table>

    <md-card class="no-records" v-if="records.length === 0">
      <md-card-content>
        <md-button disabled class="md-mini">No records found...</md-button>
        <router-link to="/records/add">
          <md-button class="md-fab md-mini">
            <md-icon>add</md-icon>
          </md-button>
        </router-link>
      </md-card-content>
    </md-card>

    <div class="actionDiv">
      <md-button class="md-primary md-raised md-icon-button md-mini" @click="previousPage()" :disabled="page <= 1">
        <md-icon>navigate_before</md-icon>
      </md-button>
      <md-button class="page-button" disabled>{{ page }}/{{ pages }}</md-button>
      <md-button class="md-primary md-raised md-icon-button md-mini" @click="nextPage()" :disabled="page === pages">
        <md-icon>navigate_next</md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
import { environment } from '@/environments/environment'
const axios = require('axios')
const backendUrl = environment.apiURL + 'records'

export default {
  name: 'RecordsList',
  data () {
    return {
      search: '',
      records: [],
      page: 1,
      paginate: 10,
      pages: null,
      results: null
    }
  },
  computed: {
  },
  mounted () {
    axios.get(backendUrl + `?page=${this.page}&paginate=${this.paginate}`)
      .then(response => {
        this.records = response.data.docs
        this.pages = response.data.pages
        this.results = response.data.results
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    getRecords () {
      axios.get(backendUrl + `?page=${this.page}&paginate=${this.paginate}&search=${this.search}`)
        .then(response => {
          this.records = response.data.docs
          this.pages = response.data.pages
          this.results = response.data.results
        })
        .catch(err => {
          console.log(err)
        })
    },
    nextPage () {
      if (this.page < this.pages) {
        this.page++
        this.getRecords()
      }
    },
    previousPage () {
      if (this.page > 1) {
        this.page--
        this.getRecords()
      }
    },
    searchRecord () {
      this.page = 1
      this.getRecords()
    }
  }
}
</script>

<style scoped>
  .actionDiv{
    margin-top: 15px;
    text-align: center;
  }
  .actionDiv .page-button{
    min-width: 30px;
  }
  .no-records{
    text-align: center;
    color: #888;
  }
</style>
