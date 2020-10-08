const express = require("express")
const handlebars = require("handlebars")
const expressHandlebars = require("express-handlebars")
const { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access")
const Restaurant = require("./model/Restaurant")
const Menu = require("./model/Menu")
const Item = require("./model/Item")

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

app.get("/", async (req, res) => {
    res.render("index")
})

// overriding index to restaurant site
app.get('/v1/restaurants', async (req, res) => {
    try {
        data = await Restaurant.findAll({
            include: {all: true, nested: true}
        })

        /*
        data = data.map((i) => {
            if (!i.image) i.image = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/No_image_available_600_x_450.svg/1280px-No_image_available_600_x_450.svg.png"
        })
        */

    } catch (err) {
        console.log(err);
        data = [{name: "no such restaurant"}]
    }

    res.render("restaurants", {
        title: "Restaurants",
        page: "Main Page",
        restaurant: data,
        managerRef: "/v1/restaurants/manager"
    })
})

app.get("/v1/restaurants/manager", async (req, res) => {
    var restaurants
    try {
        restaurants = await Restaurant.findAll()
    } catch(err) {
        console.log(err);
    }

    res.render("restaurants_manager", {
        restaurants: restaurants
    })
})

// MARK: - restaurants
app.get("/v1/restaurants/:id", async (req, res) => {
    try {
        data = await Restaurant.findByPk(req.params.id, {include: {all: true, nested: true}, })
        if (!data.image) data.image = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/No_image_available_600_x_450.svg/1280px-No_image_available_600_x_450.svg.png"
    } catch (err) {
        console.log(err);
        data = [{name: "no such restaurant"}]
    }

    res.render("restaurant", {
        restaurant: data,
        title: data.name
    })
})

app.put("/v1/restaurants/:id", async (req, res) => {
    let data = req.body

    try {
        let data = await Restaurant.update(data, { where: req.params.id })
        res.json(data)
    } catch (err) {
        res.json(err)
    }
})

app.patch("/v1/restaurants/:id", async (req, res) => {

})

app.delete("/v1/restaurants/:id", async (req, res) => {
    let data = req.body

    try {
        let data = await Restaurant.destroy({where: {Id: req.params.id}})
        res.json(data)
    } catch (err) {
        res.json(err)
    }
})

app.post("/v1/restaurants", async (req, res) => {
    try {
        let a = await Restaurant.create(req.body)

        res.redirect(`/v1/restaurants/manager#${a.id}`)
    } catch (err) {
        console.log(err);
        res.json({
            result: -1,
            reason: err
        })
    }
})
// MARK: end -

// MARK - menus
app.get("/v1/menus/manager", async (req, res) => {
    var menus
    try {
        menus = await Menu.findAll()
    } catch(err) {
        console.log(err);
    }

    res.render("menu_manager", {
        menus: menus
    })
})

app.delete("/v1/menus/:id", async (req, res) => {
    let data = req.body

    try {
        let data = await Menu.destroy({where: {Id: req.params.id}})
        res.json(data)
    } catch (err) {
        res.json(err)
    }
})

app.post("/v1/menus", async (req, res) => {
    try {
        console.log(req.body);
        let a = await Menu.create(req.body)

        res.redirect(`/v1/menus/manager#${a.id}`)
    } catch (err) {
        console.log(err);
        res.json({
            result: -1,
            reason: err
        })
    }
})

// MARK: end -

// setting the server to listen
app.listen(3000, async () => {
    console.log("Web server has started :)");
    // init data from the data base

    Restaurant.hasMany(Menu)
    Menu.belongsTo(Restaurant)
    Menu.hasMany(Item)
    Item.belongsTo(Menu)
})