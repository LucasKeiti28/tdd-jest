/* eslint-disable quotes */
const request = require("supertest");

const app = require("../../src/app");

const mail = `${Date.now()}@email.com`;

test("Should list all users", async () => {
  const response = await request(app).get("/users");
  expect(response.status).toBe(200);
  expect(response.body.length).toBeGreaterThan(0);
});

test("Should return an user", async () => {
  const response = await request(app).post("/users").send({
    name: "Paul",
    email: mail,
    password: "123123",
  });
  expect(response.status).toBe(201);
  expect(response.body.name).toBe("Paul");
});

test("Should not be able to insert an user without name", async () => {
  const response = await request(app).post("/users").send({
    email: "teste@mail.com",
    password: "123123",
  });
  expect(response.status).toBe(400);
  expect(response.body.error).toBe("Name must be provided.");
});

test("Should not be able to insert an user without an unique e-mail", async () => {
  const response = await request(app)
    .post("/users")
    .send({ name: "Paul", password: "123123" });

  expect(response.status).toBe(400);
  expect(response.body.error).toBe("Email must be provided.");
});

test("Should no be able to insert an user without password", (done) => {
  request(app)
    .post("/users")
    .send({
      name: "Paul",
      email: "email@email.com",
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Password must be provided.");
      done();
    })
    .catch((err) => done.fail(err));
});

test("Email must be unique", async () => {
  const response = await request(app).post("/users").send({
    name: "Paul",
    email: mail,
    password: "123123",
  });
  expect(response.status).toBe(400);
  expect(response.body.error).toBe("Email must be unique.");
});
