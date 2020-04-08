/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable quotes */

const ValidationError = require("../errors/ValidationError");

module.exports = (app) => {
  const findAll = (user_id) => app.db("accounts").where({ user_id });

  const find = (filter = {}) => app.db("accounts").where(filter).first();

  const save = async (account) => {
    if (!account.name) throw new ValidationError("Must have name");

    const accountDB = await find({
      name: account.name,
      user_id: account.user_id,
    });
    if (accountDB) {
      throw new ValidationError("Duplicated name for the same user");
    }

    return app.db("accounts").insert(account, "*");
  };

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
    find,
  };
};
