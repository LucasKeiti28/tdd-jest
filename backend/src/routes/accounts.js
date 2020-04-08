/* eslint-disable consistent-return */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
const express = require("express");

const ValidationError403 = require("../errors/ValidationError403");

module.exports = (app) => {
  const router = express.Router();

  // router.param("id", (req, res, next) => {
  //   app.services.account
  //     .find({ id: req.user.id })
  //     .then((acc) => {
  //       if (acc.user_id !== req.user.id) throw new ValidationError403();
  //       else next();
  //     })
  //     .catch((error) => next(error));
  // });

  router.param("id", async (req, res, next) => {
    try {
      const accountDB = await app.services.account.find({ id: req.params.id });
      if (accountDB.user_id !== req.user.id) throw new ValidationError403();
      else next();
    } catch (error) {
      return next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const data = req.body;

      const response = await app.services.account.save({
        ...data,
        user_id: req.user.id,
      });

      return res.status(201).json(response[0]);
    } catch (error) {
      return next(error);
    }
  });

  router.get("/", async (req, res, next) => {
    try {
      const response = await app.services.account.findAll(req.user.id);

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const response = await app.services.account.show({ id: req.params.id });
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      const response = await app.services.account.update(
        req.params.id,
        req.body
      );
      return res.status(200).json(response[0]);
    } catch (error) {
      return next(error);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      await app.services.account.remove(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  });
  return router;
};
