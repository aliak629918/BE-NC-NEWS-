const db = require("../db/connection");

exports.fetchArticles = (sort_by = "created_at", order = "DESC") => {
  const validOrder = ["ASC", "DESC"];
  const inputOrder = order.toUpperCase();
  const validSortBy = ["title", "topic", "author", "created_at", "votes"];

  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "invalid order query" });
  }
  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "invalid sort query" });
  }
  let queryString = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, COUNT(comment_id)::INT AS comment_count FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

  return db.query(queryString).then((result) => {
    return result.rows;
  });
};

exports.fetchArticleById = (id) => {
  if (typeof id !== "number")
    return db
      .query(
        `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes FROM articles WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
        [id]
      )
      .then(({ rows: [response] }) => {
        if (response === undefined) {
          return Promise.reject({
            status: 404,
            msg: "Article Not Found!",
          });
        }
        return response;
      });
};

exports.patchVote = (id, inc_vote) => {
  if (inc_vote === undefined) {
    return db
      .query("SELECT * FROM articles WHERE article_id = $1;", [id])
      .then(({ rows }) => {
        return rows[0];
      });
  }
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING*",
      [inc_vote, id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article Does Not Exist!",
        });
      }
      return rows[0];
    });
};
