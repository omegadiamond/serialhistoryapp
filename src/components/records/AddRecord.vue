<template>
    <div>
      <form novalidate @submit.prevent="validateRecord">
        <md-card>
          <md-card-header>
            <h1 class="md-title" v-if="record.serial_number">Add Record for Serial #: <md-content class="serial-num">{{ record.serial_number }}</md-content> </h1>
            <h1 class="md-title" v-else>Add New Product Record</h1>
          </md-card-header>

          <md-card-content>
            <md-field :class="getValidationClass('serial_number')" v-if="record.created_at">
              <label for="serial_number">Serial #</label>
              <md-input name="serial_number" id="serial_number" v-model.trim="record.serial_number" :disabled="submitted"/>
              <span class="md-error" v-if="!$v.record.serial_number.required">Serial # should be {{ $v.record.serial_number.$params.minLength.min }} characters long</span>
              <span class="md-error" v-else-if="!$v.record.serial_number.minlength && !v.record.serial_number.maxlength">Serial # should be {{ $v.record.serial_number.$params.minLength.min }} characters long</span>
            </md-field>

            <md-field :class="getValidationClass('product_code')">
              <label for="product_code">Product Code</label>
              <md-input name="product_code" id="product_code" v-model.trim="record.product_code" :disabled="submitted" ref="product_code" v-focus="focused" @focus="focused = true" @blur="focused = false"/>
              <span class="md-error" v-if="!$v.record.product_code.required">Product Code is required</span>
              <span class="md-error" v-else-if="!$v.record.product_code.minlength && !$v.record.product_code.maxlength">Product Code should be between {{ $v.record.product_code.$params.minLength.min }} and {{ $v.record.product_code.$params.maxLength.max }} characters</span>
            </md-field>

            <md-field :class="getValidationClass('sales_order')">
              <label for="sales_order">Sales Order #</label>
              <md-input name="sales_order" id="sales_order" v-model.trim="record.sales_order" :disabled="submitted"/>
              <span class="md-error" v-if="!$v.record.sales_order.required">Sales Order # is required</span>
              <span class="md-error" v-else-if="!$v.record.sales_order.minlength && !$v.record.sales_order.maxlength">Sales Order # should be between {{ $v.record.sales_order.$params.minLength.min }} and {{ $v.record.sales_order.$params.maxLength.max }} characters</span>
            </md-field>

            <md-field :class="getValidationClass('customer_id')">
              <label for="customer_id">Customer ID</label>
              <md-input name="customer_id" id="customer_id" v-model.trim="record.customer_id" :disabled="submitted"/>
              <span class="md-error" v-if="!$v.record.customer_id.required">Customer ID is required</span>
              <span class="md-error" v-else-if="!$v.record.customer_id.minlength && !$v.record.customer_id.maxlength">Customer ID should be between {{ $v.record.customer_id.$params.minLength.min }} and {{ $v.record.customer_id.$params.maxLength.max }} characters</span>
            </md-field>

            <datepicker
              :class="getValidationClass('warranty_to')"
              class="datepicker md-field md-theme-default"
              v-model="record.warranty_to"
              :clear-button="true"
              :placeholder="'Warranty Expires On'"
              :disabled="submitted"
            >
            </datepicker>

            <md-field :class="getValidationClass('description')">
              <label for="description">Description</label>
              <md-textarea name="description" id="description" v-model.trim="record.description" :disabled="submitted" md-autogrow/>
              <span class="md-error" v-if="!$v.record.description.required">Description is required</span>
              <span class="md-error" v-else-if="!$v.record.description.minlength">Description should be at least {{ $v.record.description.$params.minLength.min }} characters</span>
            </md-field>
          </md-card-content>

          <md-card-actions v-bind:style="[recordSaved ? {'justify-content': 'space-between'} : {}]">
            <md-content class="md-headline" v-if="newSerialNumber">New Serial #:
              <md-content class="serial-num">{{ newSerialNumber }}</md-content>
            </md-content>
            <md-content class="md-headline" v-else-if="recordSaved && record.serial_number" style="color: gray">Added..</md-content>

            <md-button type="submit" class="md-primary md-raised" :disabled="submitted">
              <span v-if="record.created_at">Add</span>
              <span v-else>Get Serial #</span>
            </md-button>
          </md-card-actions>
        </md-card>
      </form>

      <div class="actionDiv" v-if="recordSaved">
        <md-button class="md-raised md-accent" @click="resetRecordForm">
          <md-icon>add</md-icon> Add New
        </md-button>
        <md-button class="md-raised md-primary" @click="$emit('listRecords')">
          <md-icon>list</md-icon> View All
        </md-button>
      </div>
    </div>
</template>

<script>
import { mixin as focusMixin } from 'vue-focus'
import { validationMixin } from 'vuelidate'
import {
  required,
  minLength,
  maxLength
} from 'vuelidate/lib/validators'
import axios from 'axios'
import { environment } from '@/environments/environment'
import Datepicker from 'vuejs-datepicker'
const backendUrl = environment.apiURL + 'records'

export default {
  name: 'AddRecord',
  components: {Datepicker},
  mixins: [validationMixin, focusMixin],
  props: {
    newRecord: {}
  },
  data: () => ({
    focused: true,
    record: {
      serial_number: null,
      product_code: null,
      sales_order: null,
      customer_id: null,
      description: null,
      warranty_to: null
    },
    submitted: false,
    recordSaved: false,
    newSerialNumber: null
  }),
  validations: {
    record: {
      product_code: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(7)
      },
      sales_order: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(20)
      },
      customer_id: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(20)
      },
      description: {
        required,
        minLength: minLength(5)
      },
      serial_number: {
        minLength: minLength(6),
        maxLength: maxLength(6)
      }
    }
  },
  mounted () {
    if (this.newRecord) {
      this.record = this.newRecord
      this.focused = false
    } else {
      this.resetRecordForm()
    }
  },
  watch: {
    newRecord: function (val) {
      if (!val) {
        this.resetRecordForm()
      }
    }
  },
  methods: {
    getValidationClass (fieldName) {
      const field = this.$v.record[fieldName]
      if (field) {
        return { 'md-invalid': field.$invalid && field.$dirty }
      }
    },
    validateRecord () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.saveRecord()
      }
    },
    saveRecord () {
      this.submitted = true

      axios.post(backendUrl, {
        serial_number: this.record.serial_number,
        product_code: this.record.product_code,
        sales_order: this.record.sales_order,
        customer_id: this.record.customer_id,
        warranty_to: this.record.warranty_to,
        description: this.record.description
      })
        .then(response => {
          if (!this.record.serial_number) {
            this.newSerialNumber = response.data.record.serial_number
          }
          this.recordSaved = true
        })
        .catch(err => {
          console.error(err)
          alert('DB error occurred')
        })
    },
    resetRecordForm () {
      this.record = {
        product_code: null,
        sales_order: null,
        customer_id: null,
        warranty_to: '',
        description: null,
        serial_number: null
      }
      this.submitted = false
      this.recordSaved = false
      this.newSerialNumber = null
      this.$v.$reset()
      this.focused = true
    }
  }
}
</script>

<style scoped>
  .md-card{
    max-width: 600px;
    margin: 30px auto auto;
  }
  .md-content{
    display: inline-block;
    padding: 0 5px;
  }
  .serial-num {
    color: blueviolet;
    font-weight: bold;
  }
  .actionDiv{
    margin-top: 15px;
    text-align: center;
  }
</style>
