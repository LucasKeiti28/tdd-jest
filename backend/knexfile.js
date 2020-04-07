/* eslint-disable quotes */
module.exports = {
  test: {
    client: "pg",
    version: "9.6",
    connection: {
      host: "localhost",
      user: "postgres",
      password: "docker",
      database: "testes",
    },
    migrations: {
      directory: "src/migrations",
    },
  },
};
