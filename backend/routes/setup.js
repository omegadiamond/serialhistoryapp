const express = require('express')
const router = express.Router()
const sequelize = require('../db')
const fs = require('fs')
// const Record = require('../models/Record')

router.get('/', (req, res, next) => {
  fs.readFile(__dirname + '/../db/setup.sql', 'utf-8', (err, queryString) => {
    if (err) {
      res.status(500).json({error: 'Error in reading setup.sql file'})
      throw err
    }

    sequelize.query(queryString).spread((results, metadata) => {
      res.json({message: 'Database is successfully configured'})
      console.log(results, metadata)
    })
      .catch(err => {
        res.status(500).json({error: 'Error in setting up DB'})
        throw err
      })
  })
})

module.exports = router
