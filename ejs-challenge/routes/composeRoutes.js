const express = require('express');
const News = require('../models/news')
const newsControllers = require('../controllers/newsControllers')
const router = express.Router()

router.route("/compose")
    .get(newsControllers.news_compose_get)
    .post(newsControllers.news_compose_post);

router.route("/edit/:id")
    .get(newsControllers.news_edit_get)
    .patch(newsControllers.news_edit_update)
    .delete(newsControllers.news_edit_delete);

router.route("/:id")
    .get(newsControllers.news_detail);

router.route("/")
    .get(newsControllers.news_category);

module.exports = router