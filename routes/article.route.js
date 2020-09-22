const express = require('express');
const router = express.Router();

const articleController = require('../controllers/article');

router.post('/articles', articleController.createArticle);
router.put('/articles/:articleId', articleController.updateArticle);
router.get('/articles', articleController.getArticles);
router.delete('/articles/:articleId', articleController.deleteArticle);


module.exports = router;