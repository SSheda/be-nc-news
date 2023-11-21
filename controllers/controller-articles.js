const { selectArticleById } = require("../models/model-articles");

exports.getArticleById = (req, res, next) => {
    const articleId = req.params.article_id;
    
    selectArticleById(articleId)
    .then((article) => {
        res.status(200).send({ article });
      })
      .catch(next);
}