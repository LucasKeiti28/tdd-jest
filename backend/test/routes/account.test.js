/* eslint-disable comma-dangle */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable quotes */
const request = require("supertest");
const jwt = require("jwt-simple");

const app = require("../../src/app");

const MAIN_ROUTE = "/v1/accounts";
let user;
let user2;

beforeEach(async () => {
  const res = await app.services.user.save({
    name: "User Account",
    email: `${Date.now()}@email.com`,
    password: "123123",
  });
  user = { ...res[0] };
  user.token = jwt.encode(user, "ChaveSecreta");

  const res2 = await app.services.user.save({
    name: "User Account 2",
    email: `${Date.now()}@email.com`,
    password: "123123",
  });
  user2 = { ...res2[0] };
});

test("Should not insert an account without name", async () => {
  const response = await request(app)
    .post(MAIN_ROUTE)
    .send({ user_id: user.id })
    .set("authorization", `bearer ${user.token}`);

  expect(response.status).toBe(400);
  expect(response.body.error).toBe("Must have name");
});

test("Should not insert a duplicated account for same user.", async () => {
  await request(app)
    .post(MAIN_ROUTE)
    .send({
      name: "Nome Duplicado",
      user_id: user.id,
    })
    .set("authorization", `bearer ${user.token}`);

  const response = await request(app)
    .post(MAIN_ROUTE)
    .send({
      name: "Nome Duplicado",
      user_id: user.id,
    })
    .set("authorization", `bearer ${user.token}`);

  expect(response.status).toBe(400);
  expect(response.body.error).toBe("Duplicated name for the same user");
});

test("Should insert account successfuly", () =>
  request(app)
    .post(MAIN_ROUTE)
    .send({ name: "Acc #1" })
    .set("authorization", `bearer ${user.token}`)
    .then((result) => {
      expect(result.status).toBe(201);
      expect(result.body.name).toBe("Acc #1");
    }));

// test("Should list all accounts", async () => {
//   await app.db("accounts").insert({
//     name: "Acc List",
//     user_id: user.id,
//   });

//   const response = await request(app)
//     .get(MAIN_ROUTE)
//     .set("authorization", `bearer ${user.token}`);

//   expect(response.status).toBe(200);
//   expect(response.body.length).toBeGreaterThan(0);
// });

test("Should list all account from determinated user", async () => {
  await app.db("accounts").insert([
    { name: "Acc User #1", user_id: user.id },
    { name: "Acc User #2", user_id: user2.id },
  ]);

  const response = await request(app)
    .get(MAIN_ROUTE)
    .set("authorization", `bearer ${user.token}`);

  expect(response.status).toBe(200);
  expect(response.body.length).toBe(1);
  expect(response.body[0].name).toBe("Acc User #1");
});

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

test("Should not return an account from another user", async () => {
  const anotherAcc = await app.db("accounts").insert(
    {
      name: "Acc by #2",
      user_id: user2.id,
    },
    ["id"]
  );

  const response = await request(app)
    .get(`${MAIN_ROUTE}/${anotherAcc[0].id}`)
    .set("authorization", `bearer ${user.token}`);

  expect(response.status).toBe(403);
  expect(response.body.error).toBe(
    "You can't access accounts from another user"
  );
});

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

test("Should not update an account from another user", async () => {
  const anotherAcc = await app.db("accounts").insert(
    {
      name: "Acc by #2",
      user_id: user2.id,
    },
    ["id"]
  );

  const response = await request(app)
    .put(`${MAIN_ROUTE}/${anotherAcc[0].id}`)
    .send({ name: "Acc Updated" })
    .set("authorization", `bearer ${user.token}`);

  expect(response.status).toBe(403);
  expect(response.body.error).toBe(
    "You can't access accounts from another user"
  );
});

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

test("Should not delete an account from another user", async () => {
  const anotherAcc = await app.db("accounts").insert(
    {
      name: "Acc by #2",
      user_id: user2.id,
    },
    ["id"]
  );

  const response = await request(app)
    .delete(`${MAIN_ROUTE}/${anotherAcc[0].id}`)
    .set("authorization", `bearer ${user.token}`);

  expect(response.status).toBe(403);
  expect(response.body.error).toBe(
    "You can't access accounts from another user"
  );
});
