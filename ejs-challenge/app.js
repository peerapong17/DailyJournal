const express = require("express");
const _ = require('lodash');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const News = require('./models/news')
const newRoutes = require('./routes/composeRoutes')

const app = express();

const dbURI = "mongodb://localhost:27017/newsDB"
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(3000, function () {
      console.log("Server started on port 3000");
    });
  })
  .catch((err) => {
    console.log(err)
  })

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride('_method'))

app.get("/", function (req, res) {
  News.find(function (err, foundPosts) {
    if (!err) {
      res.render('home', { posts: foundPosts })
    } else {
      res.send(err)
    }
  }).sort({createdAt: -1})
});

app.use('/news', newRoutes)

app.use((req, res) => {
  res.status(404).render('404', {title: "404"})
})





