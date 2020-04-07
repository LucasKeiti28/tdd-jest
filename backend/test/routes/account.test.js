/* eslint-disable comma-dangle */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable quotes */
const request = require("supertest");

const app = require("../../src/app");

const MAIN_ROUTE = "/accounts";
let user;

beforeAll(async () => {
  const res = await app.services.user.save({
    name: "User Account",
    email: `${Date.now()}@email.com`,
    password: "123123",
  });
  user = { ...res[0] };
});

test("Should insert account successfuly", () =>
  request(app)
    .post(MAIN_ROUTE)
    .send({ name: "Acc #1", user_id: user.id })
    .then((result) => {
      expect(result.status).toBe(201);
      expect(result.body.name).toBe("Acc #1");
    }));

test("Should list all accounts", async () => {
  await app.db("accounts").insert({
    name: "Acc List",
    user_id: user.id,
  });

  const response = await request(app).get(MAIN_ROUTE);

  expect(response.status).toBe(200);
  expect(response.body.length).toBeGreaterThan(0);
});

test("Should return one account per id", async () => {
  const users = await app.db("accounts").insert(
    {
      name: "Acc by ID",
      user_id: user.id,
    },
    ["id"]
  );

  const response = await request(app).get(`${MAIN_ROUTE}/${users[0].id}`);

  expect(response.status).toBe(200);
  expect(response.body.name).toBe("Acc by ID");
  expect(response.body.user_id).toBe(user.id);
});
