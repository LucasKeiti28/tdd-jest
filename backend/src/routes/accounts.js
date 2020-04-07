/* eslint-disable comma-dangle */
/* eslint-disable quotes */
module.exports = (app) => {
  const create = async (req, res, next) => {
    try {
      const data = req.body;

      const response = await app.services.account.save(data);

      return res.status(201).json(response[0]);
    } catch (error) {
      return next(error);
    }
  };

  const findAll = async (req, res, next) => {
    try {
      const response = await app.services.account.findAll();

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  };

  const show = async (req, res, next) => {
    try {
      const response = await app.services.account.show({ id: req.params.id });
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  };

  const update = async (req, res, next) => {
    try {
      const response = await app.services.account.update(
        req.params.id,
        req.body
      );
      return res.status(200).json(response[0]);
    } catch (error) {
      return next(error);
    }
  };

  const remove = async (req, res, next) => {
    try {
      await app.services.account.remove(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  };
  return {
    create,
    findAll,
    show,
    update,
    remove,
  };
};
