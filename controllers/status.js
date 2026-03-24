require("dotenv").config();
const { body } = require("express-validator");
const { authenticate } = require("../auth/authenticate");
const userDB = require("../db/user");
const { checkValidations } = require("./input-validations");

const setOnlineStatus = [
  authenticate,
  body("is-online")
    .exists()
    .withMessage("is-online boolean is required")
    .isBoolean({ strict: true })
    .withMessage("is-online must be a boolean"),
  checkValidations,
  async function (req, res) {
    const isOnline = req.body["is-online"];
    const userId = req.user.id;

    const modified = await userDB.setOnlineStatus(userId, isOnline);

    if (modified) {
      res
        .status(200)
        .json({ message: "Profile updated succesfully", success: true });
    }
  },
];

module.exports = { setOnlineStatus };
