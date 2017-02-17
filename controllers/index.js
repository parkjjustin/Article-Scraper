const express = require('express');
const router = express();
const request = require("request");
const cheerio = require("cheerio");
const Article = require("../models/article.js");
const Comment = require("../models/comment.js");
var databaseUrl = "article-scraper";
var collections = ["articles"];
var mongojs = require("mongojs");


var db = mongojs(databaseUrl, collections);
router.get("/", function(req, res) {
    res.render("index")
})

router.get("/articles", function(req, res) {
    Article.find({})
        .sort({ time: -1 })
        .limit(20).populate('Comment')
        .exec(function(error, doc) {
            if (error) {
                console.log(error);
            } else {
                var hbsObject = {
                    info: doc
                }
                console.log(hbsObject)
                res.render('articles', hbsObject);
            }
        });
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
                    // console.log(doc);

                }
            });
        });

    });

    db.articles.find({}, function(error, found) {

        if (error) {
            console.log(error);
        } else {
            res.redirect("/articles");
        }
    });

});

router.post("/articles/:id", function(req, res) {
    var newComment = new Comment(req.body);
    newComment.save(function(error, doc) {
        if (error) {
            console.log(error);
        } else {
            Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "Comment": doc._id } })
                .exec(function(err, doc) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect("/articles");
                    }
                });
        }
    });
});

router.delete("/delete/:id", (req, res) => {
    Comment.remove({ _id: req.params.id }, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});







module.exports = router;