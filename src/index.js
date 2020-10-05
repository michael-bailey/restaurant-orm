const express = require("express")
const handlebars = require("handlebars")
const expressHandlebars = require("express-handlebars")
const { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access")
const { Octokit } = require("@octokit/rest")

let app = express()

github = new Octokit()

// setting sequelize fixes
let HB = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(handlebars),
})

// setting a template language
app.engine('handlebars', HB)
app.set("view engine", "handlebars")

// setting static files folder
app.use(express.static("public"))

// overriding date handle
app.get('/', async (req, res) => {
    res.render("index", {
        path: "/",
        date: Date().slice(0,15)
    })
})

app.get("/about", async (req, res) => {
    res.render("about", {
        path: "/about",
        date: Date().slice(0,15)
    })
})

app.get("/github", async (req, res) => {

    let data
    try {
        data = await github.repos.listForUser({username: "michael-bailey"})
    } catch (err) {
        data = {data: []}
    }
    let dataList = data.data
    console.log(dataList.length);

    res.render("github", {
        path: "/github",
        repos: dataList
    })
})

// setting the server to listen
app.listen(3000, async () => {
    console.log("Web server has started :)");

    // init data from the data base
})