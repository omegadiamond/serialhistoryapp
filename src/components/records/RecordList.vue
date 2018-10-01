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
        <md-table-head>
          <span @click="changeSort('serial_number')" class="sort">
            Serial #
            <md-icon v-if="sortBy === 'serial_number' && sortDirection === 'ASC'">arrow_drop_up</md-icon>
            <md-icon v-if="sortBy === 'serial_number' && sortDirection === 'DESC'">arrow_drop_down</md-icon>
          </span>
        </md-table-head>
        <md-table-head>
          <span @click="changeSort('product_code')" class="sort">
            Product Code
            <md-icon v-if="sortBy === 'product_code' && sortDirection === 'ASC'">arrow_drop_up</md-icon>
            <md-icon v-if="sortBy === 'product_code' && sortDirection === 'DESC'">arrow_drop_down</md-icon>
          </span>
        </md-table-head>
        <md-table-head>
          <span @click="changeSort('sales_order')" class="sort">
            Sales Order #
            <md-icon v-if="sortBy === 'sales_order' && sortDirection === 'ASC'">arrow_drop_up</md-icon>
            <md-icon v-if="sortBy === 'sales_order' && sortDirection === 'DESC'">arrow_drop_down</md-icon>
          </span>
        </md-table-head>
        <md-table-head>
          <span @click="changeSort('customer_id')" class="sort">
            Customer ID
            <md-icon v-if="sortBy === 'customer_id' && sortDirection === 'ASC'">arrow_drop_up</md-icon>
            <md-icon v-if="sortBy === 'customer_id' && sortDirection === 'DESC'">arrow_drop_down</md-icon>
          </span>
        </md-table-head>
        <md-table-head>
          <span @click="changeSort('description')" class="sort">
            Description
            <md-icon v-if="sortBy === 'description' && sortDirection === 'ASC'">arrow_drop_up</md-icon>
            <md-icon v-if="sortBy === 'description' && sortDirection === 'DESC'">arrow_drop_down</md-icon>
          </span>
        </md-table-head>
        <md-table-head>
          <span @click="changeSort('warranty_to')" class="sort">
            Warranty Ends
            <md-icon v-if="sortBy === 'warranty_to' && sortDirection === 'ASC'">arrow_drop_up</md-icon>
            <md-icon v-if="sortBy === 'warranty_to' && sortDirection === 'DESC'">arrow_drop_down</md-icon>
          </span>
        </md-table-head>
        <md-table-head>
          <span @click="changeSort('created_at')" class="sort">
            Added
            <md-icon v-if="sortBy === 'created_at' && sortDirection === 'ASC'">arrow_drop_up</md-icon>
            <md-icon v-if="sortBy === 'created_at' && sortDirection === 'DESC'">arrow_drop_down</md-icon>
          </span>
        </md-table-head>
        <md-table-head>
          <span @click="changeSort('created_by')" class="sort">
            By
            <md-icon v-if="sortBy === 'created_by' && sortDirection === 'ASC'">arrow_drop_up</md-icon>
            <md-icon v-if="sortBy === 'created_by' && sortDirection === 'DESC'">arrow_drop_down</md-icon>
          </span>
        </md-table-head>
      </md-table-row>

      <md-table-row v-for="(record, index) in records" :key="index" @click="onSelect(record)" class="record-row">
        <md-table-cell><a @click.prevent="addRecordBySerial(record)" class="record-serial">{{ record.serial_number }}</a></md-table-cell>
        <md-table-cell>{{ record.product_code }}</md-table-cell>
        <md-table-cell>{{ record.sales_order }}</md-table-cell>
        <md-table-cell>{{ record.customer_id }}</md-table-cell>
        <md-table-cell class="record-description">
          <!--<truncate clamp="Read More" :length="300" less="Show Less" type="html" :text="record.description"></truncate>-->
          <span v-if="selectedRecord === record">{{ selectedRecord.description }}</span>
          <span v-else>{{ record.description | truncate(300) }}</span>
        </md-table-cell>
        <md-table-cell>{{ record.warranty_to }}</md-table-cell>
        <md-table-cell>{{ record.created_at }}</md-table-cell>
        <md-table-cell>{{ record.created_by }}</md-table-cell>
      </md-table-row>
    </md-table>

    <md-card class="no-records" v-if="records.length === 0">
      <md-card-content>
        <md-button disabled class="md-mini">No records found...</md-button>
        <router-link to="/records/add">
          <md-button class="md-button md-accent md-raised">
            <md-icon>add</md-icon> Add New
          </md-button>
        </router-link>
      </md-card-content>
    </md-card>

    <div class="actionDiv">
      <md-button class="md-primary md-raised md-icon-button md-mini" @click="firstPage()" :disabled="page <= 1" style="margin-right: 10px;">
        <md-icon>first_page</md-icon>
      </md-button>

      <md-button class="md-primary md-raised md-icon-button md-mini" @click="previousPage()" :disabled="page <= 1">
        <md-icon>navigate_before</md-icon>
      </md-button>
      <md-button class="page-button" disabled>{{ page }}/{{ pages }}</md-button>
      <md-button class="md-primary md-raised md-icon-button md-mini" @click="nextPage()" :disabled="page === pages">
        <md-icon>navigate_next</md-icon>
      </md-button>

      <md-button class="md-primary md-raised md-icon-button md-mini" @click="lastPage()" :disabled="page === pages" style="margin-left: 10px;">
        <md-icon>last_page</md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { environment } from '@/environments/environment'
import truncate from 'vue-truncate-collapsed'
const backendUrl = environment.apiURL + 'records'

export default {
  name: 'RecordsList',
  components: {
    truncate
  },
  data () {
    return {
      search: '',
      records: [],
      page: 1,
      paginate: 10,
      pages: null,
      results: 0,
      sortBy: 'created_at',
      sortDirection: 'DESC',
      selectedRecord: null
    }
  },
  mounted () {
    this.getRecords()
  },
  methods: {
    getRecords () {
      axios.get(backendUrl + `?page=${this.page}&paginate=${this.paginate}&search=${this.search}&sortBy=${this.sortBy}&sortDirection=${this.sortDirection}`)
        .then(response => {
          this.records = response.data.docs
          this.pages = response.data.pages
          this.results = response.data.results
        })
        .catch(err => {
          console.log(err)
        })
    },
    changeSort (column) {
      if (this.sortBy === column && this.sortDirection === 'ASC') {
        this.sortDirection = 'DESC'
      } else {
        this.sortDirection = 'ASC'
      }
      this.sortBy = column
      this.getRecords()
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
    firstPage () {
      this.page = 1
      this.getRecords()
    },
    lastPage () {
      this.page = this.pages
      this.getRecords()
    },
    searchRecord () {
      this.firstPage()
    },
    onSelect (record) {
      this.selectedRecord = record
    },
    addRecordBySerial (record) {
      record.description = ''
      this.$router.push({name: 'add-record', params: {record: record}})
    }
  },
  filters: {
    truncate: function (text, length) {
      length = length || 300
      return text.length > length ? text.slice(0, length) + '...' : text
    }
  }
}
</script>

<style scoped>
  span.sort{
    cursor: pointer;
  }
  /*.record-row{
    cursor: pointer;
  }*/
  .record-serial{
    cursor: pointer;
  }
  .record-description{
    white-space: pre-wrap;
  }

  .no-records{
    text-align: center;
    color: #888;
  }
  .actionDiv{
    margin-top: 15px;
    text-align: center;
  }
  .actionDiv .page-button{
    min-width: 30px;
  }
</style>
