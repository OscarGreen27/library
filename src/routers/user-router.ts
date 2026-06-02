import express from "express";
import * as userContreller from "../controllers/user-controller.js";

const userRouter = express.Router();

userRouter.post("/singup", userContreller.registerUser);
userRouter.post("/login", userContreller.authentificateUser);
userRouter.post("/logout", userContreller.destroySession);

export default userRouter;
