const express = require('express')
const checkAuth = require('./middlewares/check-auth')

const recordsRoute = require('./routes/records')
const setupRoute = require('./routes/setup')

var app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
  next()
})

app.use('/setup', setupRoute)
app.use('/records', checkAuth, recordsRoute)

module.exports = app
