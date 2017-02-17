var express = require('express');
var router = express();
var request = require("request");
var cheerio = require("cheerio");
var Article = require("../models/article.js");
var Comment = require("../models/comment.js");
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
                res.render('articles', hbsObject);
            }
        });
});


router.get("/saved", function(req, res) {
    Article.find({})
        .sort({ time: -1 })
        .populate('Comment')
        .exec(function(error, doc) {
            if (error) {
                console.log(error);
            } else {
                var object = {
                    info: doc
                }
                res.render('saved', object);
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
            result.date = $(this).find(".trb_outfit_categorySectionHeading_date").attr("data-dt");

            var entry = new Article(result);

            entry.save(function(err, doc) {

                if (err) {
                    console.log(err);
                } else {

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

router.delete("/delete/:id", function(req, res) {
    Comment.remove({ "_id": req.params.id }, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/articles");
        }
    });
});

router.put("/save/:id", function(req, res) {
    Article.findOneAndUpdate({ "_id": req.params.id }, { 'saved': true })
        .exec(function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/articles");
            }
        });
});


router.put("/unsave/:id", function(req, res) {
    Article.findOneAndUpdate({ "_id": req.params.id }, { 'saved': false })
        .exec(function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/saved");
            }
        });
});






module.exports = router;