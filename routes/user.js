const { Router } = require("express");
const profileController = require("../controllers/profile");
const { friendsRouter } = require("./friends");
const statusController = require("../controllers/status");

const userRouter = Router();

userRouter.put("/profile", profileController.modifyProfile);
userRouter.get("/:userId/profile", profileController.getProfile);
userRouter.use("/friends", friendsRouter);
userRouter.put("/status", statusController.setOnlineStatus);

module.exports = { userRouter };
