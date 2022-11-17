const { fetchCommentsById, postComment } = require("../models/comments.model");
const { fetchArticleById } = require("../models/articles.model");

exports.getCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsById(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  fetchArticleById(article_id)
    .then((response) => {
      return postComment(article_id, body, username);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
