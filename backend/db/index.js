const Sequelize = require('sequelize')
const sequelize = new Sequelize('serialhistory', 'serialhistory', 'serialhistory', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: { timestamp: false },
  logging: false
})

module.exports = sequelize
