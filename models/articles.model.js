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
  let queryString = `SELECT articles.*, COUNT(comment_id)::INT AS comment_count FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

  return db.query(queryString).then((result) => {
    return result.rows;
  });
};
