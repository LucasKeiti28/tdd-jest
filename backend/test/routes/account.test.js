/* eslint-disable comma-dangle */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable quotes */
const request = require("supertest");
const jwt = require("jwt-simple");

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
  user.token = jwt.encode(user, "ChaveSecreta");
});

test("Should not insert an account withou name", async () => {
  const response = await request(app)
    .post(MAIN_ROUTE)
    .send({ user_id: user.id })
    .set("authorization", `bearer ${user.token}`);

  expect(response.status).toBe(400);
  expect(response.body.error).toBe("Must have name");
});

test.skip("Should not insert a duplicated account for same user.", () => {});

test("Should insert account successfuly", () =>
  request(app)
    .post(MAIN_ROUTE)
    .send({ name: "Acc #1", user_id: user.id })
    .set("authorization", `bearer ${user.token}`)
    .then((result) => {
      expect(result.status).toBe(201);
      expect(result.body.name).toBe("Acc #1");
    }));

test("Should list all accounts", async () => {
  await app.db("accounts").insert({
    name: "Acc List",
    user_id: user.id,
  });

  const response = await request(app)
    .get(MAIN_ROUTE)
    .set("authorization", `bearer ${user.token}`);

  expect(response.status).toBe(200);
  expect(response.body.length).toBeGreaterThan(0);
});

test.skip("Should list all account from determinated user", () => {});

test("Should return one account per id", async () => {
  const users = await app.db("accounts").insert(
    {
      name: "Acc by ID",
      user_id: user.id,
    },
    ["id"]
  );

  const response = await request(app)
    .get(`${MAIN_ROUTE}/${users[0].id}`)
    .set("authorization", `bearer ${user.token}`);

  expect(response.status).toBe(200);
  expect(response.body.name).toBe("Acc by ID");
  expect(response.body.user_id).toBe(user.id);
});

test.skip("Should not return an account from another user", () => {});

test("Should update an account", async () => {
  const users = await app.db("accounts").insert(
    {
      name: "Acc to Update",
      user_id: user.id,
    },
    ["id"]
  );

  const response = await request(app)
    .put(`${MAIN_ROUTE}/${users[0].id}`)
    .send({ name: "Acc Updated" })
    .set("authorization", `bearer ${user.token}`);

  expect(response.status).toBe(200);
  expect(response.body.name).toBe("Acc Updated");
  expect(response.body.user_id).toBe(user.id);
});

test.skip("Should not update an account from another user", () => {});

test("Should delete an account", async () => {
  const users = await app.db("accounts").insert(
    {
      name: "Acc to Delete",
      user_id: user.id,
    },
    ["id"]
  );

  const response = await request(app)
    .delete(`${MAIN_ROUTE}/${users[0].id}`)
    .set("authorization", `bearer ${user.token}`);

  expect(response.status).toBe(204);
});

test.skip("Should not delete an account from another user", () => {});
