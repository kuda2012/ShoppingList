process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
let items = require("../fakeDb");

let gum = { name: "gum", price: "1.05" };

beforeEach(() => {
  items.push(gum);
});

afterEach(() => {
  items.length = 0;
});

describe("GET/ items", () => {
  it("Get all items", async () => {
    const resp = await request(app).get("/items");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ items: [gum] });
  });
});

describe("GET/ items/:item", () => {
  it("Get one item", async () => {
    const resp = await request(app).get(`/items/${gum.name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual(gum);
  });
  it("Responds with 404 if invalid cat", async () => {
    const resp = await request(app).get(`/items/cookie`);
    expect(resp.statusCode).toBe(404);
  });
});
describe("POST/ items", () => {
  it("Creating an item", async () => {
    const resp = await request(app)
      .post("/items")
      .send({ name: "sprite", price: "1.05" });
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toEqual({ item: { name: "sprite", price: "1.05" } });
  });
  it("Responds with 400 if name is missing", async () => {
    const resp = await request(app).post("/items").send({});
    expect(resp.statusCode).toBe(400);
  });
});

describe("/PATCH /items/:name", () => {
  it("Updating an items name and price", async () => {
    const resp = await request(app)
      .patch(`/items/${gum.name}`)
      .send({ name: "chicle", price: "2.00" });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ item: { name: "chicle", price: "2.00" } });
  });
  it("Updating an items name without updating price", async () => {
    const resp = await request(app)
      .patch(`/items/${gum.name}`)
      .send({ name: "cornball" });
    expect(resp.statusCode).toBe(200);
    console.log(resp.body);
    expect(resp.body).toEqual({ item: { name: "cornball", price: "2.00" } });
  });
  test("Responds with a 404 for invalid name", async () => {
    const resp = await request(app)
      .patch(`/items/chocolate`)
      .send({ name: "chicle", price: "2.00" });
    expect(resp.statusCode).toBe(404);
  });
});

describe("DELETE/ items/:name", () => {
  it("Deleting an item", async () => {
    const resp = await request(app).delete(`/items/${gum.name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ item: `${gum.name} was deleted` });
  });
  it("Responds with 404 for deleting invalid item", async () => {
    const resp = await request(app).delete(`/items/cacao`);
    expect(resp.statusCode).toBe(404);
  });
});
