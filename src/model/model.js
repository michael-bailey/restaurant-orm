const {Sequelize, Model, DataTypes} = require('sequelize')
const path = require('path')

console.log(process.env.NODE_ENV);

const sequelize = process.env.NODE_ENV === 'test'
    ? new Sequelize('sqlite::memory:', null, null, {dialect: 'sqlite'})
    : new Sequelize({dialect: 'sqlite', storage: "./data/restaurants.db"})

class Restaurant extends Model {}
Restaurant.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING
}, {sequelize})

class Menu extends Model {}
Menu.init({
    title: DataTypes.STRING
}, {sequelize})

class Item extends Model {}
Item.init({
    name: DataTypes.STRING,
    price: DataTypes.FLOAT
}, {sequelize})

Restaurant.hasMany(Menu)
Menu.belongsTo(Restaurant)
Menu.hasMany(Item)
Item.belongsTo(Menu)

module.exports = { Restaurant, Menu, Item, sequelize }