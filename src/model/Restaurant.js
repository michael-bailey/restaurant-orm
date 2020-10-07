const { Model, DataTypes } = require("sequelize");
const Menu = require("./Menu");
const sequelize = require("./database_setup")

class Restaurant extends Model {}
Restaurant.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING
}, {sequelize})
Restaurant.sync()



module.exports = Restaurant