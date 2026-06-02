import { NextFunction, Request, Response } from "express";
import { IdDtoSchema } from "../dto/request-dto/id-dto.js";

const validateId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    IdDtoSchema.parse(req.params);
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected server error occurred on the server",
    });
  }
};

export default validateId;
