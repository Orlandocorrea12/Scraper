const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

router.get("/scrape", function (req, res) {
  axios.get("https://www.theonion.com/c/news-in-brief")
    .then(function (response) {
      const $ = cheerio.load(response.data);

      $("article").each(function (i, element) {
        const result = {};
        console.log(result);

        result.title = $(this).find("h1.headline").text();
        result.link = $(this).find("h1.headline").children("a").attr("href");
        result.summary = $(this).find("div.excerpt").children("p").text();

        db.Article.create(result)
          .then(function (dbArticle) {

          })
          .catch(function (error) {
            return res.json(error);
          });
      });
      res.send("Scrape was successful!");
    });
});

router.get("/", function (req, res) {
  db.Article.find({}).limit(20)
    .then(function (scrapedData) {
      const hbsObject = { articles: scrapedData };
      console.log(hbsObject);
      res.render("index", hbsObject);
    })
    .catch(function (error) {
      res.json(error);
    });
});

router.put("/saved/:id", function (req, res) {
  db.Article.update(
    { _id: req.params.id },
    { saved: true }
  )
    .then(function (result) {
      res.json(result);
    })
    .catch(function (error) {
      res.json(error);
    });
});

router.delete("/drop-articles", function (req, res, next) {
  db.Article.remove({}, function (err) {
    if (err) {
      console.log(err)
    } else {
      console.log("articles dropped!");
    }
  })
    .then(function (dropnotes) {
      db.Note.remove({}, function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log("notes dropped!");
        }
      })
    })
});
module.exports = router;