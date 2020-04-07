/* eslint-disable curly */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable consistent-return */
/* eslint-disable quotes */
const ValidationError = require("../errors/ValidationError");

module.exports = (app) => {
  const findAll = (filter = {}) => app.db("users").where(filter).select();

  const save = async (user) => {
    if (!user.name) throw new ValidationError("Name must be provided.");
    if (!user.email) throw new ValidationError("Email must be provided.");
    if (!user.password) throw new ValidationError("Password must be provided.");

    const userDb = await findAll({ email: user.email });

    if (userDb && userDb.length > 0)
      throw new ValidationError("Email must be unique.");

    return app.db("users").insert(user, "*");
  };

  return { findAll, save };
};
