import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod/v4";
import { UserRegistrationDto } from "../dto/request-dto/user-registration-dto.js";
import { genSalt, hash } from "bcrypt-ts";
import dotenv from "dotenv";
dotenv.config();

export const regValid = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    UserRegistrationDto.parse(req.body);
    const salt = await genSalt(Number(process.env["SALT"]));

    req.body.password = await hash(req.body.password, salt);
    next();
  } catch (err) {
    console.error(err);
    if (err instanceof ZodError) {
      return res
        .status(403)
        .json({ error: "Forbiden", message: "Validation error" });
    } else {
      return res.status(500).json({
        error: "Internal Server Error",
        message: "An unexpected server error occurred on the server",
      });
    }
  }
};
