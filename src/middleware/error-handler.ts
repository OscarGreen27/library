import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod/v4";
import { AppError, fromMulterError } from "../errors/app-errors.js";
import { MulterError } from "multer";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (err instanceof ZodError) {
    const { path, message } = JSON.parse(err.message)[0];
    return res.status(422).json({ error: true, path: path, message: message });
  }

  if (err instanceof MulterError) {
    const mappedError = fromMulterError(err);
    return res.status(mappedError.statusCode).json({ error: true, message: mappedError.message });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: true,
      message: err.message,
    });
  }

  return res.status(500).json({ error: true, message: err.message || "Internal server error" });
};
