const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const availableApi = require("../endpoints.json")

beforeEach(() => {
    return seed(data);
});

afterAll(() => {
    return db.end();
});

describe("GET /api/topics", () => {
    test("404: responds with an error if path invalid", () => {
        return request(app)
            .get("/api/topiss")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Path not found');
            });
    });
    test("200: responds with an array of of topic objects, , each of which should have description and slug properties", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then((response) => {
                const topics = response.body.topics;
                expect(topics).toHaveLength(3);
                topics.forEach((topic) => {
                    expect(topic).toMatchObject({
                        description: expect.any(String),
                        slug: expect.any(String)
                    });
                });
            });
    });
});
describe("GET /api", () => {
    test("200: responds with an object describing all the available endpoints on available API", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then((response) => {
                const endpoints = response.body.endpoints;

                expect(endpoints).toEqual(availableApi)

                expect(typeof endpoints).toBe("object");
                for (const key in endpoints) {
                    expect(endpoints[key]).toMatchObject({
                        description: expect.any(String),
                        queries: expect.any(Array),
                        exampleResponse: expect.any(Object)
                    });
                }
            });
    });
});
describe("GET /api/articles/:article_id", () => {
    test(`200: responds with an article object, which should have the following properties: author,
    title, article_id, body, topic, created_at, votes, article_img_url`, () => {
        return request(app)
            .get("/api/articles/10")
            .expect(200)
            .then((response) => {
                const article = response.body.article;

                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    body: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                });
            });
    });
    test(`400: responds with an error message if article_id is not a valid type`, () => {
        return request(app)
            .get("/api/articles/banana")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request');
            });
    });
    test(`404: responds with an error message if article_id does not exist`, () => {
        return request(app)
            .get("/api/articles/14")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Path not found');
            });
    });
});

describe("GET /api/articles", () => {
    test(`200: responds with an articles array of article objects, each of which should be with the correct properties`, () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response) => {
                const articles = response.body.article;

                expect(articles.length).toBe(13)
                articles.forEach((article) => {
                    expect(article).not.toHaveProperty("body");
                    expect(article).toMatchObject({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number)
                    });
                });
            });
    });
    test(`200: responds with an articles array sorted by date in descending order`, () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response) => {
                const articles = response.body.article;

                const datesFromArticles = articles.map
                expect(articles.length).toBe(13);
                expect(articles).toBeSortedBy("created_at", { descending: true });
            });
    });

});

describe("GET /api/articles/:article_id/comments", () => {
    test(`200: responds an array of comments for the given article_id of which each comment should have the correct properties`, () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then((response) => {
                const comments = response.body.comments;

                expect(comments.length).toBe(11)

                comments.forEach((comment) => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        article_id: expect.any(Number)
                    });
                });
            });
    });
    test(`200: responds an array of comments should be sorted by date in descending order`, () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then((response) => {
                const comments = response.body.comments;

                expect(comments.length).toBe(11)
                expect(comments).toBeSortedBy("created_at", { descending: true });
            });
    });
    test(`400: responds with an error message if article_id is not a valid type`, () => {
        return request(app)
            .get("/api/articles/banana/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request');
            });
    });
    test(`200: responds with empty array if article_id is valid but has no associated comments.`, () => {
        return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then((response) => {
                const comments = response.body.comments;
                expect(comments).toEqual([]);
            });
    });
    test(`404: responds with an error message if article_id does not exist`, () => {
        return request(app)
            .get("/api/articles/25/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Path not found');
            });
    });
});
describe("POST /api/articles/:article_id/comments", () => {
    test(`201: respons with the posted comment which is an object with correct properties`, () => {
        const newComment = {
            body: "My new comment",
            username: "icellusedkars"
        };
        return request(app)
            .post("/api/articles/12/comments")
            .send(newComment)
            .expect(201)
            .then((response) => {
                const postedComment = response.body.comment;
                expect(postedComment).toEqual({
                    comment_id: 19,
                    body: expect.any(String),
                    article_id: 12,
                    author: expect.any(String),
                    votes: expect.any(Number),
                    created_at: expect.any(String)
                });
            });
    });
    test(`404: responds with an error message if article_id does not exist`, () => {
        const newComment = {
            body: "My new comment",
            username: "icellusedkars"
        };
        return request(app)
            .post("/api/articles/25/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Path not found');
            });
    });
    test(`400: responds with an error message if article_id is not a valid type`, () => {
        const newComment = {
            body: "My new comment",
            username: "icellusedkars"
        };
        return request(app)
            .post("/api/articles/bannana/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request');
            });
    });
    test(`404: responds with an error message if user does not exist`, () => {
        const newComment = {
            body: "My new comment",
            username: "jgjjh"
        };
        return request(app)
            .post("/api/articles/12/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Path not found');
            });
    });
    test("400: responds with an error message if comment has invalid keys structure", () => {
        const newComment = { username: "butter_bridge" }
        return request(app)
            .post("/api/articles/11/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request");
            });
    });
});
describe("PATCH /api/articles/:article_id", () => {
    test(`200: respons with updated only article's votes property, where votes are incremented`, () => {
        const voteChanges = { inc_votes: 100 };
        return request(app)
            .patch("/api/articles/10")
            .send(voteChanges)
            .expect(200)
            .then((response) => {
                const updatedArticle = response.body.article;
                expect(updatedArticle).toEqual({
                    article_id: 10,
                    title: "Seven inspirational thought leaders from Manchester UK",
                    topic: "mitch",
                    author: "rogersop",
                    body: "Who are we kidding, there is only one, and it's Mitch!",
                    created_at: expect.any(String),
                    votes: 100,
                    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                });
            });
    });
    test(`200: respons with updated only article's votes property, where votes are decremented`, () => {
        const voteChanges = { inc_votes: -80 };
        return request(app)
            .patch("/api/articles/10")
            .send(voteChanges)
            .expect(200)
            .then((response) => {
                const updatedArticle = response.body.article;
                expect(updatedArticle).toEqual({
                    article_id: 10,
                    title: "Seven inspirational thought leaders from Manchester UK",
                    topic: "mitch",
                    author: "rogersop",
                    body: "Who are we kidding, there is only one, and it's Mitch!",
                    created_at: expect.any(String),
                    votes: -80,
                    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                });
            });
    });
    test(`404: responds with an error message if article_id does not exist`, () => {
        const voteChanges = { inc_votes: 10 };
        return request(app)
            .patch("/api/articles/25")
            .send(voteChanges)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Path not found');
            });
    });
    test(`400: responds with an error message if article_id is not a valid type`, () => {
        const voteChanges = { inc_votes: 10 };
        return request(app)
            .patch("/api/articles/banana")
            .send(voteChanges)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request');
            });
    });
    test("400: responds with an error message if votes has invalid key name", () => {
        const voteChanges = { banana: 10 };
        return request(app)
            .patch("/api/articles/10")
            .send(voteChanges)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            })
    });
    test("200: respons with updated article's votes property, and ignores other keys", () => {
        const voteChanges = { inc_votes: 10, banana: 10 };
        return request(app)
            .patch("/api/articles/10")
            .send(voteChanges)
            .expect(200)
            .then((response) => {
                const updatedArticle = response.body.article;
                expect(updatedArticle).toEqual({
                    article_id: 10,
                    title: "Seven inspirational thought leaders from Manchester UK",
                    topic: "mitch",
                    author: "rogersop",
                    body: "Who are we kidding, there is only one, and it's Mitch!",
                    created_at: expect.any(String),
                    votes: 10,
                    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                });
            });
    });
});
describe("DELETE /api/comments/:comment_id", () => {
    test(`204: deletes comment and respons with 204 status error, comment has no content`, () => {
        return request(app)
            .delete("/api/comments/1")
            .expect(204)
    });
    test(`404: responds with error 404 status when used comment id that was deleted`, () => {
        return request(app)
            .get("/api/comments/1")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Path not found');
            });
    });
    test(`404: responds with error 404 status when used non-existed comment id `, () => {
        return request(app)
            .get("/api/comments/88")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Path not found');
            });
    });
    test(`400: responds with an error message if comment_id is not a valid type`, () => {
        return request(app)
            .delete("/api/comments/banana")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request');
            });
    });
});