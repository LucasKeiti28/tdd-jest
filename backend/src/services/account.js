/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable quotes */

const ValidationError = require("../errors/ValidationError");

module.exports = (app) => {
  const save = async (account) => {
    if (!account.name) throw new ValidationError("Must have name");

    return app.db("accounts").insert(account, "*");
  };

  const findAll = () => app.db("accounts");

  const show = (id) => app.db("accounts").where(id).first();

  const update = (id, data) =>
    app.db("accounts").where({ id }).update(data, "*");

  const remove = (id) => app.db("accounts").where({ id }).del();

  return {
    save,
    findAll,
    show,
    update,
    remove,
  };
};
