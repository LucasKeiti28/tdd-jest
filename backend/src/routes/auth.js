/* eslint-disable consistent-return */
/* eslint-disable quotes */
const jwt = require("jwt-simple");
const bcrypt = require("bcrypt-nodejs");

const ValidationError = require("../errors/ValidationError");

module.exports = (app) => {
  const signin = async (req, res, next) => {
    try {
      const userDB = await app.services.user.findOne({ email: req.body.email });

      if (!userDB) throw new ValidationError("Auth failed");

      if (bcrypt.compareSync(req.body.password, userDB.password)) {
        const payload = {
          id: userDB.id,
          name: userDB.name,
          email: userDB.email,
        };
        const token = jwt.encode(payload, "ChaveSecreta");
        return res.status(200).json({ token });
      }
      throw new ValidationError("Auth failed");
    } catch (error) {
      return next(error);
    }
  };
  return { signin };
};
