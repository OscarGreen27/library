import { NextFunction, Request, Response } from "express";
import * as authorService from "../service/author-service.js";
import { QueryParamSchema } from "../dto/request-dto/query-param-dto.js";
import { IdDtoSchema } from "../dto/request-dto/id-dto.js";
import { NewAuthorSchema } from "../dto/request-dto/new-author-dto.js";

export const getAuthors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { offset, limit } = QueryParamSchema.parse(req.query);
    const result = await authorService.getAuthors(offset, limit);
    res.status(200).json({
      ok: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const getAuthor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = IdDtoSchema.parse(req.params["id"]);
    const result = await authorService.getAuthor(id);
    res.status(200).json({ ok: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const addAuthor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = NewAuthorSchema.parse(req.body);
    const result = await authorService.addAuthor(name);
    res.status(201).json({ ok: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const deleteAuthor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = IdDtoSchema.parse(req.params["id"]);
    const result = await authorService.deleteAuthors(id);
    res.status(200).json({
      ok: result,
    });
  } catch (err) {
    next(err);
  }
};
