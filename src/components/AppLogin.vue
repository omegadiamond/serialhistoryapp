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
          </md-card-content>
          <md-card-actions>
            <md-button class="md-primary" type="submit">Login</md-button>
          </md-card-actions>
        </md-card>
      </form>
    </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { EventBus } from '@/event-bus'

export default {
  name: 'Login',
  mixins: [validationMixin],
  data: () => ({
    name: null
  }),
  validations: {
    name: {
      required,
      minLength: minLength(4),
      maxLength: maxLength(30)
    }
  },
  methods: {
    validateUser () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.loginUser()
      }
    },
    loginUser () {
      EventBus.$emit('login', this.name)
      // this.$router.push('/records/add')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.login-card{
  max-width: 400px;
  margin: 30px auto auto;
}
</style>
