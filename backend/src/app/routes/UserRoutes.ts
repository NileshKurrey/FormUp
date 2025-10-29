import express from "express";
import { UserController } from "../controllers/UserController.js";

const userRouter = express.Router();
const userController = new UserController();

userRouter.route("/login/:oidcType").get(userController.login);
userRouter.route("/callback/:oidcType").get(userController.callback);

export default userRouter;