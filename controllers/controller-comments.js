const { insertComment } = require("../models/model-comments");
const { selectCommentsByArticleId } = require("../models/model-comments");
const { checkExists } = require("../utils/utils-functions");

exports.getCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  const commentsPromises = [selectCommentsByArticleId(articleId)]
  if (articleId) {
    commentsPromises.push(checkExists("articles", "article_id", articleId))
  }
  Promise.all(commentsPromises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0]
      res.status(200).send({ comments });
    })
    .catch(next);
}


exports.postSingleComment = (req, res, next) => {
  const newComment = req.body;
  const {article_id} = req.params;
  const { username } = newComment;
    
  const commentsPromises = [checkExists("articles", "article_id", article_id), checkExists("users", "username", username), insertComment(article_id, newComment)]

     
  Promise.all(commentsPromises)
    .then((resolvedPromises) => {
      const comment = resolvedPromises[2]
      res.status(201).send({ comment });
    })
    .catch(next);
}