const { Router } = require("express");
const passwordController = require("../controllers/password");

const passwordRouter = Router();

passwordRouter.put("/", passwordController.modifyPassword);

module.exports = { passwordRouter };
