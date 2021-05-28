//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const app = express();
// const multer = require('multer')
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/images')
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + ".jpg")
//   }
// })

// var upload = multer({ storage: storage })

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride('_method'))

mongoose.connect("mongodb://localhost:27017/newsDB", { useNewUrlParser: true, useUnifiedTopology: true })

const newsSchema = {
  title: String,
  category: String,
  content: String,
  date: String,
  image: String
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


app.get("/compose", function (req, res) {
  res.render("compose", { categories });
})

app.post("/compose" ,function (req, res) {
  const { postTitle, postContent, postCategory, postDate, postImage} = req.body
  
  const news = new News({
    title: postTitle,
    category: postCategory,
    content: postContent,
    date: postDate,
    image: postImage
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

app.get("/show/", function (req, res) {
  const {category} = req.query
  News.find({ category: category }, function (err, foundTopics) {
    if (!err) {
      res.render("category", { posts: foundTopics, category})
    } else {
      res.send(err)
    }
  })
});

app.listen(8080, function () {
  console.log("Server started on port 3000");
});
