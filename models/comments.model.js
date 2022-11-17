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
