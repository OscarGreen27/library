import express from "express";
import * as userContreller from "../controllers/user-controller.js";

const userRouter = express.Router();

userRouter.post("/singup", userContreller.singup);
userRouter.post("/login", userContreller.login);
userRouter.post("/logout", userContreller.logout);

export default userRouter;
