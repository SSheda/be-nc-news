const { selectCommentsByArticleId} = require("../models/model-comments");
const { checkExists } = require("../utils/utils-functions");

exports.getCommentsByArticleId = (req, res, next) => {

    const articleId = req.params.article_id;

    const commentsPromises = [selectCommentsByArticleId(articleId)]

    if(articleId){
      commentsPromises.push(checkExists("articles", "article_id", articleId))
    }

    Promise.all(commentsPromises)
    .then((resolvedPromises) => {
        const comments = resolvedPromises[0]
        res.status(200).send({comments});
      })
      .catch(next);
}