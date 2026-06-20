import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod/v4";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  if (err instanceof ZodError) {
    const message = JSON.parse(err.message)[0].message;
    res.status(422).json({ error: true, message: message });
  } else {
    res
      .status(500)
      .json({
        error: true,
        message: "An unexpected server error occurred on the server",
      });
  }
};
