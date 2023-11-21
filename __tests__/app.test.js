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
                for (const key in endpoints){
                    expect(endpoints[key]).toMatchObject({
                        description: expect.any(String),
                        queries: expect.any(Array),
                        exampleResponse: expect.any(Object)
                    });
                }
            });
    });          
});  
