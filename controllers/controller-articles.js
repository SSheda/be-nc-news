const { selectArticleById, selectAllArticles } = require("../models/model-articles");

exports.getArticleById = (req, res, next) => {
    const articleId = req.params.article_id;
    
    selectArticleById(articleId)
    .then((article) => {
        res.status(200).send({ article });
      })
      .catch(next);
}

exports.getAllArticles = (req, res, next) => {
    
    selectAllArticles()
    .then((article) => {
        res.status(200).send({ article });
      })
      .catch(next);
}

