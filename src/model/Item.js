const { Model, DataTypes } = require("sequelize");
const Menu = require("./Menu");
const sequelize = require("./database_setup")

class Item extends Model {}
Item.init({
    name: DataTypes.STRING,
    price: DataTypes.FLOAT
}, {sequelize})
Item.sync()



module.exports = Item