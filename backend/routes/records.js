const express = require('express')
const router = express.Router()
const { Op } = require('../config/db')
const Record = require('../models/Record')

router.get('/', (req, res, next) => {

  const search = req.query.search;
  var searchWhere = {}
  if (search) {
    searchWhere = { serial_number: { [Op.like]: `%${search}%` } }
  }

  const options = {
    attributes: ['serial_number', 'product_code', 'sales_order', 'customer_id', 'description'],
    page: req.query.page || 1,
    paginate: req.query.paginate || 10,
    order: [['created_at', 'DESC']],
    where: searchWhere
  }
  Record.paginate(options)
    .then(records => {
      res.status(200).json(records)
    })
    .catch(err => {
      res.status(500).send('Internal Server Error')
      throw err
    })
})

router.post('/', (req, res, next) => {
  Record.create({
    created_by: 'someone',
    serial_number: '1',
    product_code: 'sdf',
    sales_order: 'jiewrj',
    customer_id: '23567647',
    description: 'description'
  })
    .then(result => {
      console.log(result.serial_number)
    })
    .catch(err => {
      throw err
    })

  res.json({test: 'this is RECORD test'})
})

module.exports = router
