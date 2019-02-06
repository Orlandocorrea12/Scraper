const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const scraperRoutes = require("./controllers/controller.js");
const savedRoutes = require("./controllers/saved-articles.js");
const exphbs = require("express-handlebars");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";;
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
const app = express();

app.use(logger("dev"));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");


app.use(scraperRoutes, savedRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});