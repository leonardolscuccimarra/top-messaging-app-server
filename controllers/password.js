require("dotenv").config();
const { body } = require("express-validator");
const { authenticate } = require("../auth/authenticate");
const userDB = require("../db/user");
const { checkValidations } = require("./input-validations");
const bcrypt = require("bcryptjs");

function validatePasswords() {
  return [
    body("current-password")
      .exists()
      .withMessage("current-password is required.")
      .custom(async (currentPassword, { req }) => {
        const { password } = await userDB.getUserByUsername(req.user.username);
        const match = await bcrypt.compare(currentPassword, password);
        if (!match) {
          throw new Error("Invalid current-password!");
        }
        return true;
      }),
    body("new-password")
      .exists()
      .withMessage("new-password is required.")
      .isLength({ min: 8 })
      .withMessage("new-password must be at least 8 characters."),
    body("confirm-password")
      .exists()
      .withMessage("confirm-password is required")
      .custom((confirmPassword, { req }) => {
        if (confirmPassword !== req.body["new-password"]) {
          throw new Error("new-password must be equal to confirm-password!");
        }
        return true;
      }),
  ];
}

const modifyPassword = [
  authenticate,
  validatePasswords(),
  checkValidations,
  async function (req, res) {
    const newPassword = req.body["new-password"];
    const securePassword = await bcrypt.hash(newPassword, 10);

    const updated = await userDB.modifyPasswordById(
      req.user.id,
      securePassword,
    );

    if (updated) {
      res
        .status(200)
        .json({ message: "Password updated succesfuly", success: true });
    } else {
      res.status(500).json({ errors: ["Error creating user"] });
    }
  },
];

module.exports = { modifyPassword };
