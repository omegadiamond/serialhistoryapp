const express = require('express')
const router = express.Router()
const { Op } = require('../db')
const Record = require('../models/Record')
const checkAuth = require('../middlewares/check-auth')

router.get('/', checkAuth, (req, res, next) => {
  console.log(req.query)
  const search = req.query.search
  const sortBy = req.query.sortBy || 'created_at'
  const sortDirection = req.query.sortDirection || 'DESC'
  var searchWhere = {}
  if (search) {
    searchWhere = { [Op.or]: [
      { serial_number: {[Op.iLike]: `%${search}%` }},
      { product_code: {[Op.iLike]: `%${search}%` }},
      { sales_order: {[Op.iLike]: `%${search}%` }},
      { customer_id: {[Op.iLike]: `%${search}%` }} ] }
  }

  const options = {
    attributes: ['serial_number', 'product_code', 'sales_order', 'customer_id', 'description', 'warranty_to', 'created_at'],
    page: req.query.page || 1,
    paginate: req.query.paginate || 10,
    order: [[sortBy, sortDirection]],
    where: searchWhere
  }
  Record.paginate(options)
    .then(records => {
      res.status(200).json(records)
    })
    .catch(err => {
      res.status(500).json({error: 'Cannot get records'})
      throw err
    })
})

router.post('/', checkAuth, (req, res, next) => {
  Record.create({
    created_by: req.username,
    product_code: req.body.product_code,
    sales_order: req.body.sales_order,
    customer_id: req.body.customer_id,
    description: req.body.description,
    warranty_to: req.body.warranty_to
  })
    .then(result => {
      res.status(201).json({ record: result })
    })
    .catch(err => {
      res.status(500).json({ error: 'can\'t create new record' })
      throw err
    })
})

module.exports = router
