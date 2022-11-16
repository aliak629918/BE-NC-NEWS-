const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");
const {
  getArticles,
  getArticleId,
} = require("./controllers/articles.controller");

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleId);

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
