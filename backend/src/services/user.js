/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable curly */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable consistent-return */
/* eslint-disable quotes */
const bcrypt = require("bcrypt-nodejs");

const ValidationError = require("../errors/ValidationError");

module.exports = (app) => {
  const findAll = () => app.db("users").select(["id", "name", "email"]);

  const findOne = (filter = {}) => app.db("users").where(filter).first();

  const getPasswordHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  const save = async (user) => {
    if (!user.name) throw new ValidationError("Name must be provided.");
    if (!user.email) throw new ValidationError("Email must be provided.");
    if (!user.password) throw new ValidationError("Password must be provided.");

    const userDb = await findOne({ email: user.email });

    if (userDb) throw new ValidationError("Email must be unique.");

    const newUser = { ...user };

    newUser.password = getPasswordHash(user.password);

    const userSave = app.db("users").insert(newUser, ["id", "name", "email"]);

    return userSave;
  };

  return { findAll, findOne, save };
};
