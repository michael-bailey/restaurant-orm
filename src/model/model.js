const {Model, DataTypes, Sequelize} = require("sequelize")
const sequelize = new Sequelize("sqlite:./db.db")

// MARK: - Classes
class Restaurant extends Model {}
Restaurant.init({
    name: DataTypes.STRING,
    location: DataTypes.STRING,
},{
    sequelize,
})

class Table extends Model {}
Table.init({
    number: DataTypes.INTEGER,
    seats: DataTypes.INTEGER
}, {
    sequelize
})

class Booking extends Model {}
Booking.init({
    groupName: DataTypes.STRING,
    date: DataTypes.DATE,
}, {
    sequelize
})

class Menu extends Model {}
Menu.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING
}, {
    sequelize
})

class MenuItem extends Model {}
MenuItem.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING
}, {
    sequelize
})

class Ingredient extends Model {}
Ingredient.init({
    name: DataTypes.STRING,
    isAllergen: DataTypes.BOOLEAN
}, {
    sequelize
})

// MARK: - Relations for table chain
Restaurant.hasMany(Table)
Table.belongsTo(Restaurant)
Table.hasMany(Booking)
Booking.belongsTo(Table)


Restaurant.hasMany(Menu)
Menu.belongsToMany(Restaurant, {through: "menu_ref"})
Menu.hasMany(MenuItem)
MenuItem.belongsToMany(Menu, {through: "menu_item_ref"})
MenuItem.hasMany(Ingredient)
Ingredient.belongsToMany(MenuItem, {through: "ingredient_ref"})


module.exports = {Restaurant, Table, Menu, MenuItem, Ingredient, sequelize}