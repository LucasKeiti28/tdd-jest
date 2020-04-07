/* eslint-disable quotes */
module.exports = (app) => {
  const create = async (req, res) => {
    const data = req.body;

    const response = await app.services.account.save(data);

    return res.status(201).json(response[0]);
  };

  const findAll = async (req, res) => {
    const response = await app.services.account.findAll();
    return res.status(200).json(response);
  };

  const show = async (req, res) => {
    const response = await app.services.account.show({ id: req.params.id });
    return res.status(200).json(response);
  };
  return { create, findAll, show };
};
