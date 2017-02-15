const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/article-scraper');
const db = mongoose.connection;
const routes = require('./controllers/index');

var Article = require("./models/article.js");
const comment = require("./models/comment.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Mongoose mpromise deprecated - use bluebird promises
// var Promise = require("bluebird");

// mongoose.Promise = Promise;

// Init App
const app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static(process.cwd() + "/public"));
app.use(methodOverride("_method"));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), () => {
    console.log("Server started on port " + app.get('port'))
});