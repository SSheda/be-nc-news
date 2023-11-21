const express = require(`express`);
const { getAllTopics } = require("./controllers/controller-topics");
const { getAllEndpoints } = require("./controllers/controller-endpoints");
const { getArticleById } = require("./controllers/controller-articles");
const { handlePsqlErrors, handleCustomerErrors, handleServerError, handlePathNotFound } = require("./errors");

const app = express();

app.get("/api", getAllEndpoints)         
app.get("/api/topics", getAllTopics);   
app.get("/api/articles/:article_id", getArticleById)     


app.all('*', handlePathNotFound);

app.use (handlePsqlErrors)
app.use(handleCustomerErrors);
app.use(handleServerError);


//GET /api/articles  responds with a list of articles

//GET /api/articles/:article_id/comments  responds with a list of comments by article_id

//POST /api/articles/:article_id/comments  add a comment by article_id

//PATCH /api/articles/:article_id   updates an article by article_id

//DELETE /api/comments/:comment_id   deletes a comment by comment_id

//GET /api/users  responds with a list of users

//GET /api/articles (queries)    allows articles to be filtered and sorted

//GET /api/articles/:article_id (comment count)    adds a comment count to the response when retrieving a single article

module.exports = app;


