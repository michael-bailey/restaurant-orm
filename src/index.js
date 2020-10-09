const express = require("express")
const handlebars = require("handlebars")
const expressHandlebars = require("express-handlebars")
const { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access")
const Restaurant = require("./model/Restaurant")
const Menu = require("./model/Menu")
const Item = require("./model/Item")
const sequelize = require("./model/database_setup")

let app = express()

// setting sequelize fixes
let HB = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(handlebars),
})

// setting a template language
app.engine('handlebars', HB)
app.set("view engine", "handlebars")

// setting static files folder
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(express.json())


// MARK: -page paths

const index = "/"
const restaurants_page = "/restaurants"
const restaurant_page = "/restaurants/:restaurant_id"
const restaurant_menu_page = "/restaurants/:restaurant_id/:menu_id"

// MARK: - manager page paths
const restaurant_manager = "/restaurants/manager"
const restaurant_menus_manager = "/restaurant/:restaurant_id/manager"
const restaurant_menu_items_manager = "/restaurant/:restaurant_id/menus/:menu_id/items/manager"

// MARK - api paths
const api_restaurants = "/v1/restaurants"
const api_restaurant = "/v1/restaurants/:restaurant_id"
const api_restaurant_menus = "/v1/restaurants/:restaurant_id/menus"
const api_restaurant_menu = "/v1/restaurants/:restaurant_id/menus/:menu_id"
const api_restaurant_menu_items = "/v1/restaurants/:restaurant_id/menus/:menu_id/items"
const api_restaurant_menu_item = "/v1/restaurants/:restaurant_id/menus/:menu_id/items/:item_id"


// TODO: - implement
const api_restaurant_table = "/v1/restaurants/:id/tables/:id"
const api_restaurant_booking = "/v1/restaurants/:id/tables/:id/booking/:id"


app.get(index, async (req, res) => {
    res.render("index")
})

// MARK: - pages
// MARK: - restaurant page

// restaurants page
app.get(restaurants_page, async (req, res) => {
    try {
        data = await Restaurant.findAll({include: {all: true, nested: true}})

    } catch (err) {
        console.log(err);
        data = [{name: "no such restaurant"}]
    }

    res.render("restaurants", {
        title: "Restaurants",
        restaurant: data,
        managerRef: restaurant_manager
    })
})

// MARK: - restaurant page
app.get(restaurant_page, async (req, res) => {
    try {
        data = await Restaurant.findByPk(req.params.restaurant_id, {include: {nested: true, all: true}})
        console.log(data);
    } catch (err) {
        res.json(err)
    }

    res.render("restaurant", {
        title: "Restaurants",
        restaurant: data,
        managerRef: `/restaurants/${req.params.restaurant_id}/manager`
    })
})

// MARK: - menus page
app.get(restaurant_menu_page, async (req, res) => {

    restaurant_id = req.params.restaurant_id
    menu_id = req.params.menu_id

    try {
        
        data = await Menu.findByPk(menu_id, {include: {nested: true, all: true}})
        image = (await Restaurant.findByPk(restaurant_id)).image

        
    } catch (err) {
        res.json(err)
    }
    
    res.render("menu", {
        menu: data,
        image: image,
        managerRef: `/restaurants/${restaurant_id}/menus/${menu_id}/items/manager`
    })
    
})

// MARK: - manager pages
// MARK: - restaurant manager
app.get(restaurant_manager, async (req, res) => {
    try {
        res.render("restaurant_manager", {
            restaurants: await Restaurant.findAll()
        })
    } catch (err) {
        res.json(err)
    }
})

// MARK: - menu manager
app.get(restaurant_menus_manager, async (req, res) => {
    try {
        res.render("menu_manager", {
            menus: await Menu.findAll({where: {RestaurantId: req.params.restaurant_id}})
        })
    } catch (err) {
        res.json(err)
    }
})

// MARK: - item manager
app.get(restaurant_menu_items_manager, async (req, res) => {
    try {
        res.render("item_manager", {
            items: await Item.findAll({where: {MenuId: req.params.menu_id}})
        })
    } catch (err) {
        res.json(err)
    }
})


// MARK: - apis
// restaurants routes
app.route(api_restaurants)
.get(async (req, res) => {
    let data = await Restaurant.findAll()
    res.json(data)
})
.post(async (req, res) => {
    try {
        await Restaurant.create(req.body)
        res.json(await Restaurant.findAll())
    } catch (err) {
        console.log(err);
        res.json(err)
    }
})

// retaurant routes
app.route(api_restaurant)
.get(async (req, res) => {
    try {
        let restaurant_id = req.params.restaurant_id
        let data = await Restaurant.findByPk(restaurant_id)
        res.json(data)
    } catch (err) {
        res.json(err)
    }
})
.put(async (req, res) => {
    try {
        let data = req.body
        let r = await Restaurant.findByPk(req.params.id)
        await r.update(data)
        await r.save()
    
        req.method = "GET"
        res.redirect("/v1/restaurants/manager")
    } catch (err) {
        res.json(err)
    }
})
.delete(async (req, res) => {
    try {
        await Restaurant.destroy({where: {id: req.params.restaurant_id}})
        res.json(await Restaurant.findAll())
    } catch (err) {
        res.json(err)
    }
})

// menus routes
app.route(api_restaurant_menus)
.get(async (req, res) => {
    try {
        let restaurant_id = req.params.restaurant_id
        let menus = await Menu.findAll({where: {RestaurantId: restaurant_id}})
        res.json(menus)
    } catch (err) {
        res.json(err)
    }
})
.post(async (req, res) => {
    try {
        req.body.RestaurantId = req.params.restaurant_id
        await Menu.create(req.body)
        res.json(await Menu.findAll({where: {RestaurantId: req.params.restaurant_id}}))
    } catch (err) {
        res.json(err)
    }
})

// menu routes
app.route(api_restaurant_menu)
.get(async (req, res) => {
    try {   
        let restaurant_id = req.params.restaurant_id
        let menu_id = req.params.menu_id
        let data = await Menu.findByPk(menu_id)
        res.json(data)
    } catch (err) {
        res.json(err)
    }
})
.put(async (req, res) => {
    try {
        let data = req.body
        let m = await Menu.findByPk(req.params.menu_id)
        await m.update(data)
        await m.save()

        res.json(await Menu.findAll())
    } catch (err) {
        res.json(err)
    }
})
.delete(async (req, res) => {
    try {
        await Menu.destroy({where: {id: req.params.menu_id}})
        res.json(await Restaurant.findAll())
    } catch (err) {
        res.json(err)
    }
})

// menu items routes
app.route(api_restaurant_menu_items)
.get(async (req, res) => {
    try {
        let restaurant_id = req.params.restaurant_id
        let menu_id = req.params.menu_id
        let items = await Item.findAll({where: {MenuId: menu_id}})
        res.json(items)
    } catch (err) {
        res.json(err)
    }
})
.post(async (req, res) => {
    try {
        req.body.MenuId = req.params.menu_id

        await Item.create(req.body)
        res.json(await Item.findAll({where: {MenuId: req.params.menu_id}}))
    } catch (err) {
        res.json(err)
    }
})

// menu item routes
app.route(api_restaurant_menu_item)
.get(async (req, res) => {
    try {   
        let restaurant_id = req.params.restaurant_id
        let menu_id = req.params.menu_id
        let item_id = req.params.item_id
        let data = await Item.findByPk(item_id)
        res.json(data)
    } catch (err) {
        res.json(err)
    }
})
.put(async (req, res) => {
    try {
        let data = req.body
        let m = await Item.findByPk(req.params.item_id)
        await m.update(data)
        await m.save()

        res.json(await Menu.findAll())
    } catch (err) {
        res.json(err)
    }
})
.delete(async (req, res) => {
    try {
        await Item.destroy({where: {id: req.params.item_id}})
        res.json(await Restaurant.findAll())
    } catch (err) {
        res.json(err)
    }
})

// setting the server to listen
app.listen(3000, async () => {
    console.log("Web server has started :)");
    // init data from the data base

    Restaurant.hasMany(Menu)
    Menu.belongsTo(Restaurant)
    Menu.hasMany(Item)
    Item.belongsTo(Menu)
})