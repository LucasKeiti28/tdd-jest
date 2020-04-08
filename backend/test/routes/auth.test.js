/* eslint-disable comma-dangle */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable quotes */
const request = require("supertest");

const app = require("../../src/app");

test("Should create new user using signup route", async () => {
  const response = await request(app)
    .post("/auth/signup")
    .send({
      name: "signup",
      email: `${Date.now()}@email.com`,
      password: "123123",
    });

  expect(response.status).toBe(201);
  expect(response.body.name).toBe("signup");
  expect(response.body).toHaveProperty("email");
  expect(response.body).not.toHaveProperty("password");
});

test("Should received token when logged in", async () => {
  const email = `${Date.now()}@email.com`;
  const password = "123123";

  await app.services.user.save({
    name: "Teste Login",
    email,
    password,
  });

  const response = await request(app).post("/auth/signin").send({
    email,
    password,
  });

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("token");
});

test("Auth failed with wrong password", async () => {
  const email = `${Date.now()}@email.com`;
  const password = "123123";

  await app.services.user.save({
    name: "Teste Login",
    email,
    password,
  });

  const response = await request(app).post("/auth/signin").send({
    email,
    password: "123456",
  });

  expect(response.status).toBe(400);
  expect(response.body.error).toBe("Auth failed");
});

test("Auth failed with user not exist", async () => {
  const response = await request(app).post("/auth/signin").send({
    email: "123123@email.com",
    password: "123456123",
  });

  expect(response.status).toBe(400);
  expect(response.body.error).toBe("Auth failed");
});

test("Should not access authenticate route with valid token", async () => {
  const response = await request(app).get("/v1/users");

  expect(response.status).toBe(401);
});
