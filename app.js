const express = require(`express`);
const { getAllTopics } = require("./controllers/controller-topics");
const { errorHandler, handleNotFound } = require("./errors");
const { getAllEndpoints } = require("./controllers/controller-endpoints");

const app = express();

//app.use(express.json());

app.get("/api", getAllEndpoints)         //responds with a list of available endpoints

app.get("/api/topics", getAllTopics);   //responds with a list of topics .

app.use(errorHandler);

app.all('*', handleNotFound);

//GET /api/articles/:article_id  responds with a single article by article_id

//GET /api/articles  responds with a list of articles

//GET /api/articles/:article_id/comments  responds with a list of comments by article_id

//POST /api/articles/:article_id/comments  add a comment by article_id

//PATCH /api/articles/:article_id   updates an article by article_id

//DELETE /api/comments/:comment_id   deletes a comment by comment_id

//GET /api/users  responds with a list of users

//GET /api/articles (queries)    allows articles to be filtered and sorted

//GET /api/articles/:article_id (comment count)    adds a comment count to the response when retrieving a single article

module.exports = app;


