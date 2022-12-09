const { response } = require("express");
const db = require("../db/connection");

exports.fetchCommentsById = (id) => {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1;", [id])
    .then((response) => {
      if (response.rows.length === 0) {
        return db
          .query("SELECT * FROM articles WHERE article_id = $1", [id])
          .then((result) => {
            if (result.rows.length > 0) {
              return response.rows;
            }
            return Promise.reject({
              status: 404,
              msg: "No Comments Exist!",
            });
          });
      }
      return response.rows;
    });
};

exports.postComment = (id, body, username) => {
  const validUsers = ["butter_bridge", "icellusedkars", "rogersop", "lurker", "tickle122", "grumpy19", "happyamy2016", "cooljmessy", "weegembump", "jessjelly"];
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Invalid Request!" });
  }
  if (!validUsers.includes(username)) {
    return Promise.reject({ status: 404, msg: "User Not Found!" });
  }
  return db
    .query(
      "INSERT INTO comments (article_id, body, author) VALUES  ($1, $2, $3) RETURNING *;",
      [id, body, username]
    )
    .then((response) => {
      return response.rows[0];
    });
};
