import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import AppLogin from '@/components/AppLogin'
import AddRecord from '@/components/records/AddRecord'
import { EventBus } from '@/router/event-bus'

Vue.use(Router)

var loggedIn = false
var loggedName = null

EventBus.$on('login', (name) => {
  loggedIn = true
  loggedName = name
})

const ifAuthenticated = (to, from, next) => {
  if (loggedIn) {
    to.query.author = loggedName
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
      component: HelloWorld,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/login',
      component: AppLogin,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/records/add',
      component: AddRecord,
      beforeEnter: ifAuthenticated
    }
  ]
})
