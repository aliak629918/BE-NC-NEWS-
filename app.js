const express = require("express");
const app = express();
const cors = require('cors');
const { getTopics } = require("./controllers/topics.controller");
const {
  getArticles,
  getArticleId,
  patchArticle,
} = require("./controllers/articles.controller");
const {
  getCommentsById,
  postComment,
} = require("./controllers/comments.controller");
const { getUsers } = require("./controllers/users.controller");

app.use(cors());
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleId);
app.get("/api/articles/:article_id/comments", getCommentsById);
app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticle);

app.use("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found!" });
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "Article Not Found" });
  } else next(err);
});
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid Request!" });
  } else next(err);
});
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});
app.use((err, req, res, next) => {
  req.status(500).send({ msg: "Internal Server Error" });
});
module.exports = app;
