<template>
    <div>
      <form novalidate @submit.prevent="validateRecord">
        <md-card>
          <md-card-header>
            <h1 class="md-title" v-if="record.serial_number">Add more information for Serial #: <md-content class="serial-num">{{ record.serial_number }}</md-content> </h1>
            <h1 class="md-title" v-else>Get new serial number</h1>
          </md-card-header>

          <md-card-content>
            <md-field :class="getValidationClass('serial_number')" v-if="record.created_at">
              <label for="serial_number">Serial #</label>
              <md-input id="serial_number" v-model.trim="record.serial_number" :disabled="submitted"/>
              <span class="md-error" v-if="!$v.record.serial_number.required">Serial # should be {{ $v.record.serial_number.$params.minLength.min }} characters long</span>
              <span class="md-error" v-else-if="!$v.record.serial_number.minlength && !v.record.serial_number.maxlength">Serial # should be {{ $v.record.serial_number.$params.minLength.min }} characters long</span>
            </md-field>

            <md-field :class="getValidationClass('product_code')">
              <label for="product_code">Product Code</label>
              <md-input id="product_code" v-model.trim="record.product_code" :disabled="submitted" ref="product_code" v-focus="focused" @focus="focused = true" @blur="focused = false"/>
              <span class="md-error" v-if="!$v.record.product_code.minlength && !$v.record.product_code.maxlength">Product Code should be between {{ $v.record.product_code.$params.minLength.min }} and {{ $v.record.product_code.$params.maxLength.max }} characters</span>
            </md-field>

            <md-field :class="getValidationClass('sales_order')">
              <label for="sales_order">Sales Order #</label>
              <md-input id="sales_order" v-model.trim="record.sales_order" :disabled="submitted"/>
              <span class="md-error" v-if="!$v.record.sales_order.required">Sales Order # is required</span>
              <span class="md-error" v-else-if="!$v.record.sales_order.minlength && !$v.record.sales_order.maxlength">Sales Order # should be between {{ $v.record.sales_order.$params.minLength.min }} and {{ $v.record.sales_order.$params.maxLength.max }} characters</span>
            </md-field>

            <md-field :class="getValidationClass('customer_id_sold')">
              <label for="customer_id_sold">Customer ID sold to</label>
              <md-input id="customer_id_sold" v-model.trim="record.customer_id_sold" :disabled="submitted"/>
              <span class="md-error" v-if="!$v.record.customer_id_sold.required">Customer ID is required</span>
              <span class="md-error" v-else-if="!$v.record.customer_id_sold.minlength && !$v.record.customer_id_sold.maxlength">Customer ID should be between {{ $v.record.customer_id_sold.$params.minLength.min }} and {{ $v.record.customer_id_sold.$params.maxLength.max }} characters</span>
            </md-field>

            <md-field :class="getValidationClass('customer_id_ship')">
              <label for="customer_id_ship">Customer Name shipped to</label>
              <md-input id="customer_id_ship" v-model.trim="record.customer_id_ship" :disabled="submitted"/>
            </md-field>

            <datepicker
              :class="getValidationClass('warranty_to')"
              class="datepicker md-field md-theme-default"
              v-model="record.warranty_to"
              :clear-button="true"
              :placeholder="'Warranty Expires On'"
              :disabled="submitted">
            </datepicker>

            <md-field :class="getValidationClass('description')">
              <label for="description">Description*</label>
              <md-textarea name="description" id="description" v-model.trim="record.description" :disabled="submitted" md-autogrow/>
              <span class="md-error" v-if="!$v.record.description.required">Description is required</span>
              <span class="md-error" v-else-if="!$v.record.description.minlength">Description should be at least {{ $v.record.description.$params.minLength.min }} characters</span>
            </md-field>
          </md-card-content>

          <md-card-actions v-bind:style="[recordSaved ? {'justify-content': 'space-between'} : {}]">
            <md-content class="md-headline" v-if="newSerialNumber">New Serial #:
              <md-content class="serial-num">{{ newSerialNumber }}</md-content>
              <md-button class="md-icon-button" @click.prevent="copySerial(newSerialNumber)">
                <md-icon>file_copy</md-icon>
              </md-button>
            </md-content>
            <md-content class="md-headline" v-else-if="recordSaved && record.serial_number" style="color: gray">Added..</md-content>

            <!--<md-button type="button" class="md-accent md-raised" @click="resetFormFully()">
              Reset
            </md-button>-->
            <md-button type="submit" class="md-primary md-raised" :disabled="submitted">
              <span v-if="record.created_at">Add</span>
              <span v-else>Get Serial #</span>
            </md-button>
          </md-card-actions>
        </md-card>
      </form>

      <div class="actionDiv" v-if="recordSaved">
        <md-button class="md-raised md-accent" @click="resetFormPartually()">
          <md-icon>add</md-icon> Get Another
        </md-button>
        <md-button class="md-raised md-primary" @click="$emit('listRecords')">
          <md-icon>list</md-icon> View All
        </md-button>
      </div>

      <md-snackbar :md-active.sync="showSnackbar" :md-duration="2500" md-persistent>
        <span>Copied: {{ newSerialNumber }}</span>
      </md-snackbar>
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
import Datepicker from 'vuejs-datepicker'
import {EventBus} from '../../event-bus'

let backendUrl = 'http://' + localStorage.getItem('backendIp') + '/records'
EventBus.$on('IP_CHANGED', (ip) => {
  backendUrl = 'http://' + ip + '/records'
})

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
      customer_id_sold: null,
      customer_id_ship: null,
      description: null,
      warranty_to: null
    },
    submitted: false,
    recordSaved: false,
    newSerialNumber: null,
    showSnackbar: false
  }),
  validations: {
    record: {
      product_code: {
        minLength: minLength(2),
        maxLength: maxLength(7)
      },
      sales_order: {
        minLength: minLength(2),
        maxLength: maxLength(20)
      },
      customer_id_sold: {
        minLength: minLength(2),
        maxLength: maxLength(20)
      },
      description: {
        required,
        minLength: minLength(5)
      },
      serial_number: {
        minLength: minLength(7),
        maxLength: maxLength(7)
      }
    }
  },
  mounted () {
    if (this.newRecord) {
      this.record = this.newRecord
      this.focused = false
    } else {
      this.resetFormPartually()
    }
  },
  watch: {
    newRecord: function (val) {
      if (!val) {
        this.resetFormPartually()
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
        customer_id_sold: this.record.customer_id_sold,
        customer_id_ship: this.record.customer_id_ship,
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
    copySerial (serialNum) {
      this.$copyText(serialNum).then((e) => {
        this.showSnackbar = true
        console.log('copied')
      }, (err) => {
        console.log('to err')
        console.log('Error copying serial number', err)
      })
    },
    resetFormPartually () {
      this.record.serial_number = null
      this.record.sales_order = null
      this.record.customer_id_sold = null
      this.record.customer_id_ship = null
      this.record.warranty_to = null
      this.record.created_at = null
      this.record.created_by = null
      this.submitted = false
      this.recordSaved = false
      this.newSerialNumber = null
      this.$v.$reset()
    },
    resetFormFully () {
      this.record = {
        serial_number: null,
        product_code: null,
        sales_order: null,
        customer_id_sold: null,
        customer_id_ship: null,
        warranty_to: null,
        description: null,
        created_at: null,
        created_by: null
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
    padding: 3px 5px;
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
