const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const articles = require("../db/data/test-data/articles");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  it("200: should return an array of topics objects ", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBe(3);
        body.forEach((topic) => {
          expect.objectContaining({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  it("404: should return path not found for invalid paths", () => {
    return request(app)
      .get("/api/invalid-path")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found!");
      });
  });
});

describe("/api/articles", () => {
  it("200: should respond with an array of article objects with the following properties: author, title, article_id, topic, created_at, votes, comment_count, sorted by created date in decending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBeGreaterThan(0);
        expect(body.articles).toBeInstanceOf(Array);
        body.articles.forEach((articles) => {
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(Number),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  it("200: should be sorted by created_at in descending order by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSorted("created_at", { descending: true });
      });
  });
  it("404: should return path not found for invalid paths", () => {
    return request(app)
      .get("/api/invalid-path")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found!");
      });
  });
});

describe("/api/articles/article_id", () => {
  it("200: should respond with the specific article object with its properties ", () => {
    return request(app)
      .get(`/api/articles/1`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 100,
        });
      });
  });
  it("404: should respond with a 404 error if article_id does not exist ", () => {
    return request(app)
      .get(`/api/articles/9999999`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article Not Found!");
      });
  });
  it("400: should respond with a 400 error if article_id is a bad request ", () => {
    return request(app)
      .get(`/api/articles/beans`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Request!");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  it("200: should an array of comments for the given `article_id` of which each comment should have the following properties `comment_id` `votes` `created_at` `author` and `body`. comments should be served with the most recent comments first", () => {
    return request(app)
      .get(`/api/articles/1/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBeGreaterThan(0);
        body.comments.forEach((comment) => {
          expect.objectContaining({
            comment_id: expect.any(Number),
            author: expect.any(String),
            created_at: expect.any(Number),
            votes: expect.any(Number),
            body: expect.any(String),
          });
        });
      });
  });
  it("400: responds with 400 if article_id is invalid data type", () => {
    return request(app)
      .get("/api/articles/beans/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Request!");
      });
  });

  it("404: responds with 404 if article_id does not exist", () => {
    return request(app)
      .get("/api/articles/999999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No Comments Exist!");
      });
  });
});
