const express = require('express')
const router = express.Router()
const Record = require('../models/Record')

router.get('/', (req, res, next) => {
  Record.sync()
    .then(() => {
      console.log('Table was successfully created')
      res.status(200).json({'Message': 'Table was successfully created'})
    })
    .catch(err => setImmediate(() => {
      console.log(err.stack)
      res.status(500).json({'Error': 'Some DB error occurred!'})
      throw err
    }))
})

module.exports = router
