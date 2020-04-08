/* eslint-disable quotes */
const express = require("express");

module.exports = (app) => {
  const router = express.Router();
  router.get("/", async (req, res, next) => {
    try {
      const users = await app.services.user.findAll();
      return res.status(200).send(users);
    } catch (error) {
      return next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const data = req.body;

      const user = await app.services.user.save(data);

      return res.status(201).json(user[0]);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
