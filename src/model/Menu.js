const { Model, DataTypes } = require("sequelize");
const Item = require("./Item");
const Restaurant = require("./Restaurant");
const sequelize = require("./database_setup")

class Menu extends Model {}
Menu.init({
    title: DataTypes.STRING
}, {sequelize})
Menu.sync()



module.exports = Menu