const Sequelize = require('sequelize')
const sequelize = require('../db')
const sequelizePaginate = require('sequelize-paginate')
const moment = require('moment')

const Record = sequelize.define('record', {
  created_at: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    primaryKey: true,
    get () {
      return moment(this.getDataValue('created_at')).format('MM/DD/YY')
    }
  },
  created_by: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  serial_number: {
    type: Sequelize.CHAR(6),
    allowNull: true,
    defaultValue: null,
    primaryKey: true
  },
  product_code: {
    type: Sequelize.CHAR(7),
    allowNull: false
  },
  sales_order: {
    type: Sequelize.STRING(20),
    allowNull: false
  },
  customer_id: {
    type: Sequelize.STRING(20),
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  warranty_to: {
    type: Sequelize.DATEONLY,
    allowNull: true,
    get () {
      if (this.getDataValue('warranty_to')) {
        return moment(this.getDataValue('warranty_to')).format('MM/DD/YY')
      } else {
        return null
      }
    }
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    {
      name: 'serial_number_idx',
      fields: ['serial_number']
    },
    {
      name: 'product_code_idx',
      fields: ['product_code']
    },
    {
      name: 'customer_id_idx',
      fields: ['customer_id']
    }
  ]
})

sequelizePaginate.paginate(Record)

module.exports = Record
