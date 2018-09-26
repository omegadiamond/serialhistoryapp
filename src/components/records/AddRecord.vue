<template>
    <div>
      <form novalidate @submit.prevent="validateRecord">
        <md-card>
          <md-card-header>
            <h1 class="md-title">Add Product Record</h1>
          </md-card-header>

          <md-card-content>
            <md-field :class="getValidationClass('productCode')">
              <label for="productCode">Product Code</label>
              <md-input name="productCode" id="productCode" v-model.trim="form.productCode" :disabled="submitted"/>
              <span class="md-error" v-if="!$v.form.productCode.required">Product Code is required</span>
              <span class="md-error" v-else-if="!$v.form.productCode.minlength && !$v.form.productCode.maxlength">Invalid Product Code</span>
            </md-field>

            <md-field :class="getValidationClass('salesOrder')">
              <label for="salesOrder">Sales Order #</label>
              <md-input name="salesOrder" id="salesOrder" v-model.trim="form.salesOrder" :disabled="submitted"/>
              <span class="md-error" v-if="!$v.form.salesOrder.required">Sales Order # is required</span>
              <span class="md-error" v-else-if="!$v.form.salesOrder.minlength && !$v.form.salesOrder.maxlength">Invalid Sales Order #</span>
            </md-field>

            <md-field :class="getValidationClass('customer')">
              <label for="customer">Customer ID</label>
              <md-input name="customer" id="customer" v-model.trim="form.customer" :disabled="submitted"/>
              <span class="md-error" v-if="!$v.form.customer.required">Customer ID is required</span>
              <span class="md-error" v-else-if="!$v.form.customer.minlength && !$v.form.customer.maxlength">Invalid Customer ID</span>
            </md-field>

            <md-field :class="getValidationClass('description')">
              <label for="description">Description</label>
              <md-textarea name="description" id="description" v-model.trim="form.description" :disabled="submitted" md-autogrow/>
              <span class="md-error" v-if="!$v.form.description.required">Description is required</span>
              <span class="md-error" v-else-if="!$v.form.description.minlength && !$v.form.productCode.maxlength">Invalid Description</span>
            </md-field>
          </md-card-content>

          <md-card-actions>
            <md-button type="submit" class="md-primary" :disabled="submitted">Get Serial #</md-button>
          </md-card-actions>
        </md-card>
      </form>
    </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import {
  required,
  minLength,
  maxLength
} from 'vuelidate/lib/validators'

export default {
  name: 'AddRecord',
  mixins: [validationMixin],
  data: () => ({
    form: {
      productCode: null,
      salesOrder: null,
      customer: null,
      description: null
    },
    author: null,
    recordSaved: false,
    submitted: false,
    loggedIn: false
  }),
  validations: {
    form: {
      productCode: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(7)
      },
      salesOrder: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(20)
      },
      customer: {
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
      const field = this.$v.form[fieldName]
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
      console.log('to save record...')
      this.submitted = true
      // ToDo: save record
    }
  },
  created () {
    this.author = this.$route.query.author
  }
}
</script>

<style scoped>
  .md-card{
    max-width: 600px;
    margin: 30px auto auto;
  }
</style>
