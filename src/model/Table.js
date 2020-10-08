const { Model, DataTypes } = require("sequelize");
const Menu = require("./Menu");
const sequelize = require("./database_setup");

class Table extends Model {}
Table.init({
    seats: DataTypes.INTEGER,
    number: DataTypes.INTEGER
}, {
    sequelize
})

module.exports = Table