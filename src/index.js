const express = require("express")
const handlebars = require("handlebars")
const expressHandlebars = require("express-handlebars")
const { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access")

const {Restaurant, Menu} = require("./model/model")




let cache = undefined

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

// overriding index to restaurant site
app.get('/', async (req, res) => {
    if (!cache) {
        // loading restaurants into cache
        cache = []
    }
    try {
        data = await Restaurant.findAll({
            include: [{model: Menu}]
        })

    } catch (err) {
        console.log(err);
        data = [{name: "no such restaurant"}]
    }

    console.log(cache);
    res.render("index", {
        title: "Restaurants",
        page: "Main Page",
        restaurant: data
    })
})

// setting the server to listen
app.listen(3000, async () => {
    console.log("Web server has started :)");

    // init data from the data base
})