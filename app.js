const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");
const { getArticles } = require("./controllers/articles.controller");

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.use("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found!" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    console.log(err);
    req.status(400).send({ msg: "Internal Server Error" });
  }
});
module.exports = app;
