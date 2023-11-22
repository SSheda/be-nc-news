const { selectCommentsByArticleId } = require("../models/model-comments");

exports.getCommentsByArticleId = (req, res, next) => {
    const articleId = req.params.article_id;
    selectCommentsByArticleId(articleId)
    .then((article) => {
        res.status(200).send({ article });
      })
      .catch(next);
}