import * as userService from "../service/user-service.js";
import { UserAuthentificationDto } from "../dto/request-dto/user-authentification-dto.js";
import { UserRegistrationDto } from "../dto/request-dto/user-registration-dto.js";
import { NextFunction, Request, Response } from "express";

export const singup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUserData = UserRegistrationDto.parse(req.body);
    await userService.createUser(newUserData);
    res.status(200).json({ ok: true });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = UserAuthentificationDto.parse(req.body);
    const loginResult = await userService.login(data);
    req.session.userData = loginResult;
    res.status(200).json({
      ok: true,
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to log out",
      });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ ok: true });
  });
};
