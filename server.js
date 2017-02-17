var routes = require('./controllers/index');
var request = require("request"),
    cheerio = require("cheerio"),
    express = require("express"),
    bodyParser = require("body-parser"),
    logger = require("morgan"),
    mongoose = require("mongoose"),
    exphbs = require("express-handlebars"),
    methodOverride = require("method-override"),
    PORT = PORT = process.env.PORT || 3000,
    Comment = require("./models/comment.js"),
    Article = require("./models/article.js"),
    path = require('path');

var Promise = require("bluebird");
mongoose.Promise = Promise;

var app = express();
mongoose.connect('mongodb://localhost/article-scraper');
var db = mongoose.connection;

db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

db.once("open", function() {
    console.log("Mongoose connection successful.");
});

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static(process.cwd() + "/public"));
app.use(methodOverride("_method"));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));


// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), () => {
    console.log("Server started on port " + app.get('port'))
});