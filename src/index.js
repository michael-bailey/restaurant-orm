const express = require("express")

let app = express()

app.use(express.static("public"))

app.listen(3000, async () => {
    console.log("Web server has started :)");

    // init data from the data base
})