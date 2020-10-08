const { Model, DataTypes } = require("sequelize");
const Menu = require("./Menu");
const sequelize = require("./database_setup");

class Booking extends Model {}
Booking.init({
    date: DataTypes.DATE,
    name: DataTypes.STRING
}, {
    sequelize
})

module.exports = Booking