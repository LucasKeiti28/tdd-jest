/* eslint-disable curly */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable no-console */
/* eslint-disable quotes */
const app = require("express")();
const consign = require("consign");
const knex = require("knex");

const knexfile = require("../knexfile");

// TODO Criar chaveamento dinamico
app.db = knex(knexfile.test);

// app.get("/users", (req, res, next) => {
//   console.log("Passei aqui");
//   next();
// });

consign({ cwd: "src", verbose: false })
  .include("./config/passport.js")
  .include("./config/middlewares.js")
  .then("./services")
  .then("./routes")
  .then("./config/router.js")
  .into(app);

app.get("/", (req, res) => res.status(200).send());

app.use((req, res) => res.status(404).send("Route not found"));

// Middleware que trata os erros.
app.use((error, req, res, next) => {
  const { name, message, stack } = error;
  if (name === "ValidationError")
    res.status(400).json({ error: error.message });
  if (name === "ValidationError403")
    res.status(403).json({ error: error.message });
  else res.status(500).json({ name, message, stack });
  next();
});

// Incluindo logs utilizando eventmitters
// app.db
//   .on("query", (query) => {
//     console.log({
//       sql: query.sql,
//       bindings: query.bindings ? query.bindings.join(",") : "",
//     });
//   })
//   .on("query-response", (response) => {
//     console.log(response);
//   })
//   .on("error", (error) => console.log(error));

module.exports = app;
