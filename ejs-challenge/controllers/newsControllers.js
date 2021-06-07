const News = require('../models/news')

const categories = ["sports", "entertainment", "health", "business", "technology"];

const news_compose_get = (req, res) => {
    res.render("compose", { categories })
}

const news_compose_post = (req, res) => {
    const news = new News(req.body)
    news.save()
    res.redirect("/")
}

const news_edit_get = (req, res) => {
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
}

const news_edit_update = (req, res) => {
    const { id } = req.params
    News.findByIdAndUpdate(id, req.body, function (err) {
        if (!err) {
            res.redirect("/")
        } else {
            res.send(err)
        }
    })
}

const news_edit_delete = (req, res) => {
    const { id } = req.params
    News.findByIdAndDelete(id, function (err) {
        if (!err) {
            res.redirect("/")
        } else {
            res.send(err)
        }
    })
}

const news_detail = (req, res) => {
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
}

const news_category = (req, res) => {
    const { category } = req.query
    News.find({ category: category }, function (err, foundTopics) {
        if (!err) {
            res.render("category", { posts: foundTopics, category })
        } else {
            res.send(err)
        }
    }).sort({ createdAt: -1 })
}

module.exports = {
    news_compose_get,
    news_compose_post,
    news_edit_get,
    news_edit_update,
    news_edit_delete,
    news_detail,
    news_category
}