//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride('_method'))

mongoose.connect("mongodb://localhost:27017/newsDB", { useNewUrlParser: true })

const newsSchema = {
  title: String,
  content: String,
  category: String
}


const News = mongoose.model('New', newsSchema)

const categories = ["sports", "entertainment", "health", "business", "technology"];

app.get("/", function (req, res) {
  News.find(function (err, foundPosts) {
    if (!err) {
      res.render('home', { posts: foundPosts })
    } else {
      res.send(err)
    }
  })
});

app.get("/contact", function (req, res) {
  res.render("contact", { contact: contactContent });
});

app.route("/compose")
  .get(function (req, res) {
    res.render("compose", { categories });
  })
  .post(function (req, res) {

    const { postTitle, postContent, postCategory } = req.body

    const news = new News({
      title: postTitle,
      content: postContent,
      category: postCategory
    })

    news.save()

    res.redirect("/")
  });

app.route("/compose/:id")
  .get(function (req, res) {
    const { id } = req.params

    News.findById(id, function (err, foundItems) {
      if (!err) {
        res.render("updatepost", {
          Items: foundItems,
          categories
        });
      } else {
        res.send(err)
      }
    })
  })
  .patch(function (req, res) {
    const { id } = req.params
    News.findByIdAndUpdate(id, req.body, function (err) {
      if (!err) {
        res.redirect("/")
      } else {
        res.send(err)
      }
    })
  })
  .delete(function (req, res) {
    const { id } = req.params
    console.log(id)
    News.findByIdAndDelete(id, function (err) {
      if (!err) {
        res.redirect("/")
      } else {
        res.send(err)
      }
    })
  });

app.get("/posts/:id", function (req, res) {
  const { id } = req.params

  News.findById(id, function (err, foundItems) {
    if (!err) {
      res.render("detail", {
        Items: foundItems
      });
    } else {
      res.send(err)
    }
  })
});

app.get("/:topic", function (req, res) {
  const { topic } = req.params
  News.find({ category: topic }, function (err, foundTopics) {
    if (!err) {
      res.render("home", { posts: foundTopics })
    } else {
      res.send(err)
    }
  })
});

app.listen(8080, function () {
  console.log("Server started on port 3000");
});
