/* eslint-disable consistent-return */
/* eslint-disable quotes */
module.exports = (app) => {
  const findAll = (filter = {}) => app.db("users").where(filter).select();

  const save = async (user) => {
    if (!user.name) return { error: "Name must be provided." };
    if (!user.email) return { error: "Email must be provided." };
    if (!user.password) return { error: "Password must be provided." };

    const userDb = await findAll({ email: user.email });

    if (userDb && userDb.length > 0) return { error: "Email must be unique." };

    return app.db("users").insert(user, "*");
  };

  return { findAll, save };
};
