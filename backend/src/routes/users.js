/* eslint-disable quotes */
module.exports = (app) => {
  const findAll = async (req, res) => {
    const users = await app.services.user.findAll();
    return res.status(200).send(users);
  };

  const create = async (req, res) => {
    const data = req.body;

    const user = await app.services.user.save(data);

    if (user.error) return res.status(400).json(user);

    return res.status(201).json(user[0]);
  };

  return { findAll, create };
};
