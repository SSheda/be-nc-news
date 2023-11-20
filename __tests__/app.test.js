const request = require("supertest");                 // Imports supertest for API methods
const app = require("../app");                        // Imports the express app from app.js
const db = require("../db/connection");               // Imports the connection pool from connection.js
const data = require("../db/data/test-data/index");   // Imports the test data
const seed = require("../db/seeds/seed");             // Imports the seed function from seed.js

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
                expect(Array.isArray(topics)).toBe(true);
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