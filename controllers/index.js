const express = require('express');
const router = express.Router();
const request = require("request");
const cheerio = require("cheerio");
const Article = require("../models/article.js");
const Comment = require("../models/comment.js");
var databaseUrl = "article-scraper";
var collections = ["articles"];
var mongojs = require("mongojs");


var db = mongojs(databaseUrl, collections);

router.get('/', (req, res) => {
    res.render('index')
});

router.get("/scrape", function(req, res) {

    request("http://www.latimes.com", function(error, res, html) {
        var $ = cheerio.load(html);

        $("li.trb_outfit_group_list_item").each(function(i, element) {


            var result = {};

            result.title = $(this).children().children(".trb_outfit_relatedListTitle").children().text();
            result.link = $(this).children().attr("href");
            result.image = $(this).children().children().attr("data-baseurl");

            var entry = new Article(result);

            entry.save(function(err, doc) {

                if (err) {
                    console.log(err);
                } else {
                    console.log(doc);
                }
            });
        });

    });

    db.articles.find({}, function(error, found) {

        if (error) {
            console.log(error);
        } else {
            res.json(found);
        }
    });

    //     router.delete('/posts/:post', function(req, res, next) {
    //         removePost(req.params.post, function(err, post) {
    //             if (err)
    //                 res.send(err);

    //             res.json({ message: 'Successfully deleted' });
    //         });
    //     });

});



module.exports = router;