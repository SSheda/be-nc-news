const cors = require('cors');
const express = require(`express`);
const { getAllTopics } = require("./controllers/controller-topics");
const { getAllEndpoints } = require("./controllers/controller-endpoints");
const { getArticleById, getAllArticles, patchArticleById } = require("./controllers/controller-articles");
const { handlePsqlErrors, handleCustomerErrors, handleServerError, handlePathNotFound } = require("./errors");
const { getCommentsByArticleId, postSingleComment, deleteCommentById} = require("./controllers/controller-comments");

const app = express();

app.use(express.json());

app.use(cors());

app.get("/api", getAllEndpoints)         
app.get("/api/topics", getAllTopics);   
app.get("/api/articles/:article_id", getArticleById)     
app.get("/api/articles", getAllArticles);      
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postSingleComment) 
app.patch("/api/articles/:article_id", patchArticleById)
app.delete("/api/comments/:comment_id", deleteCommentById)
  


app.all('*', handlePathNotFound);

app.use (handlePsqlErrors)
app.use(handleCustomerErrors);
app.use(handleServerError);







//GET /api/users  responds with a list of users

//GET /api/articles (queries)    allows articles to be filtered and sorted

//GET /api/articles/:article_id (comment count)    adds a comment count to the response when retrieving a single article

module.exports = app;


