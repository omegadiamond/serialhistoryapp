import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import RecordList from '@/components/records/RecordList'
import AddRecord from '@/components/records/AddRecord'
import { EventBus } from '@/event-bus'
const axios = require('axios')

Vue.use(Router)

let loggedIn = false
let loggedName = null

EventBus.$on('login', (name) => {
  loggedIn = true
  loggedName = name
  axios.defaults.headers.common['Authorization'] = loggedName
})

const ifAuthenticated = (to, from, next) => {
  if (loggedIn) {
    to.query.loggedName = loggedName
    next()
    return
  }
  next('/login')
}

const ifNotAuthenticated = (to, from, next) => {
  if (!loggedIn) {
    next()
    return
  }
  next('/')
}

export default new Router({
  routes: [
    {
      path: '/',
      component: RecordList,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/login',
      component: Login,
      beforeEnter: ifNotAuthenticated
    },
    {
      name: 'add-record',
      path: '/records/add',
      component: AddRecord,
      beforeEnter: ifAuthenticated
    }
  ]
})
