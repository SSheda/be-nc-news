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
    test(`200: responds with an articles array of article objects, each of which should have the following
    properties: author, title, article_id, topic, created_at, votes, article_img_url, comment_count`, () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response) => {
                const articles = response.body.article;

                expect(articles.length).toBe(13)

                articles.forEach((article) => {
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
                expect(articles).toBeSortedBy("created_at", {descending: true});
            });
    });      
}); 
