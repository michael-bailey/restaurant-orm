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
        restaurant: data
    })
})

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

app.post("/v1/restaurants", async (req, res) => {

    console.log(req.body);

    let data = req.body

    if (!data.name) {
        res.json({
            result: -1,
            reason: "no name specified"
        })
    }

    try {
        let a = await Restaurant.create(req.body)

        res.json({
            result: 0,
            reason: a
        })
    } catch (err) {
        console.log(err);
        res.json({
            result: -1,
            reason: err
        })
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