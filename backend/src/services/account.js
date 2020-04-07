/* eslint-disable quotes */
module.exports = (app) => {
  const save = (account) => app.db("accounts").insert(account, "*");

  const findAll = () => app.db("accounts");

  const show = (id) => app.db("accounts").where(id).first();

  return { save, findAll, show };
};
