<template>
    <div>
      <form novalidate @submit.prevent="validateRecord">
        <md-card>
          <md-card-header>
            <h1 class="md-title">Add Product Record</h1>
          </md-card-header>

          <md-card-content>
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

            <md-datepicker v-model="record.warranty_to" md-immediately :disabled="submitted">
              <label>Warranty Ends On</label>
            </md-datepicker>

            <md-field :class="getValidationClass('description')">
              <label for="description">Description</label>
              <md-textarea name="description" id="description" v-model.trim="record.description" :disabled="submitted" md-autogrow/>
              <span class="md-error" v-if="!$v.record.description.required">Description is required</span>
              <span class="md-error" v-else-if="!$v.record.description.minlength && !$v.record.description.maxlength">Description should be between {{ $v.record.description.$params.minLength.min }} and {{ $v.record.description.$params.maxLength.max }} characters</span>
            </md-field>
          </md-card-content>

          <md-card-actions v-bind:style="[recordSaved ? {'justify-content': 'space-between'} : {}]">
            <md-content class="md-headline" v-if="record.serial_number">New Serial #:
              <md-content class="md-primary">{{ record.serial_number }}</md-content>
            </md-content>
            <md-button type="submit" class="md-primary" :disabled="submitted">Get Serial #</md-button>
          </md-card-actions>
        </md-card>
      </form>

      <div class="actionDiv" v-if="recordSaved">
        <md-button class="md-raised md-accent" @click="resetRecordForm">
          <md-icon>add</md-icon> Add New
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
const backendUrl = environment.apiURL + 'records'

export default {
  name: 'AddRecord',
  mixins: [validationMixin, focusMixin],
  data: () => ({
    focused: true,
    record: {
      product_code: null,
      sales_order: null,
      customer_id: null,
      description: null,
      warranty_to: null,
      serial_number: null
    },
    recordSaved: false,
    submitted: false
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
        minLength: minLength(5),
        maxLength: maxLength(1500)
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
        product_code: this.record.product_code,
        sales_order: this.record.sales_order,
        customer_id: this.record.customer_id,
        description: this.record.description,
        warranty_to: this.record.warranty_to
      })
        .then(response => {
          this.record = response.data.record
          this.recordSaved = true
        })
        .catch(err => {
          console.error(err)
        })
    },
    resetRecordForm () {
      this.record = {
        product_code: null,
        sales_order: null,
        customer_id: null,
        description: null,
        warranty_to: null,
        serial_number: null
      }
      this.submitted = false
      this.recordSaved = false
      this.focused = true
      this.$v.$reset()
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
  .actionDiv{
    margin-top: 15px;
    text-align: center;
  }
</style>
