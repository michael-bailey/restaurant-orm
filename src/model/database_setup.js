const {Sequelize, Model, DataTypes} = require('sequelize')
const path = require('path')

console.log(process.env.NODE_ENV);

const sequelize = process.env.NODE_ENV === 'test'
    ? new Sequelize('sqlite::memory:', null, null, {dialect: 'sqlite'})
    : new Sequelize({dialect: 'sqlite', storage: "./data/restaurants.db"})

module.exports = sequelize