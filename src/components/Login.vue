<template>
    <div>
      <form novalidate @submit.prevent="validateUser">
        <md-card class="login-card">
          <md-card-header>
            <div class="md-title">Login</div>
          </md-card-header>
          <md-card-content>
              <md-field v-bind:class="{ 'md-invalid': $v.name.$invalid && $v.name.$dirty }">
                <label for="name">Your Name</label>
                <md-input name="name" id="name" v-model.trim="name" autofocus/>
                <span class="md-error" v-if="!$v.name.required">Name is required</span>
                <span class="md-error" v-else-if="!$v.name.minlength && !$v.name.maxlength">Invalid name length</span>
              </md-field>

            <md-field v-bind:class="{ 'md-invalid': $v.ip.$invalid && $v.ip.$dirty }">
              <label for="ip">Backend IP (Micah VM)</label>
              <md-input name="ip" id="ip" v-model.trim="ip"/>
              <span class="md-error" v-if="!$v.ip.required">IP is required</span>
            </md-field>
          </md-card-content>
          <md-card-actions>
            <md-button class="md-primary md-raised" type="submit">Login</md-button>
          </md-card-actions>
        </md-card>
      </form>
    </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'Login',
  mixins: [validationMixin],
  data: () => ({
    name: null,
    ip: ''
  }),
  validations: {
    name: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(30)
    },
    ip: {
      required
    }
  },
  methods: {
    validateUser () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.$emit('onLogin', {name: this.name, ip: this.ip})
      }
    },
    getIpFromLocalStorage () {
      const ip = localStorage.getItem('backendIp')
      if (!ip) return
      this.ip = ip
    }
  },
  created () {
    this.getIpFromLocalStorage()
  }
}
</script>

<style scoped>
.login-card{
  max-width: 400px;
  margin: 30px auto auto;
}
</style>
