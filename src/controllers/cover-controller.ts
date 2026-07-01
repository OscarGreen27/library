import { NextFunction, Request, Response } from "express";
import * as coverService from "../service/cover-service.js";
import { IdDtoSchema } from "../dto/request-dto/id-dto.js";
import fs from "node:fs";
import path from "node:path";

export const addCover = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    const id = IdDtoSchema.parse(req.query["id"]);
    if (!file) {
      throw new Error("File is missing!");
    }
    await coverService.setCover(file, id);
    res.status(201).json({
      ok: true,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCover = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = IdDtoSchema.parse(req.query["id"]);
    await coverService.deleteCover(id);
    res.status(200).json({
      ok: true,
    });
  } catch (err) {
    next(err);
  }
};
/**
 * Returns a book cover file. 
 * A stream was used for implementation, if use res.sendFile() throws a "NotFoundError: Not Found" error for an unknown reason.
 * @param req 
 * @param res 
 * @param next 
 */
export const getCover = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = IdDtoSchema.parse(req.query["id"]);
    const result = await coverService.getCover(id);
    const stream = fs.createReadStream(result);
    const ext = path.extname(result).slice(1);
    res.setHeader("Content-Type", `image/${ext}`);
    stream.pipe(res);
  } catch (err) {
    next(err);
  }
};
