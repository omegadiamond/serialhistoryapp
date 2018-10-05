// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import router from './router'
import { MdToolbar, MdButton, MdField, MdCard, MdTable, MdContent, MdRipple, MdDialog } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.config.productionTip = false

Vue.use(MdToolbar)
Vue.use(MdButton)
Vue.use(MdField)
Vue.use(MdCard)
Vue.use(MdTable)
Vue.use(MdContent)
Vue.use(MdRipple)
Vue.use(MdDialog)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // router,
  components: { App },
  template: '<App/>'
})
