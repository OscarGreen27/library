import { NextFunction, Request, Response } from "express";
import * as bookService from "../service/book-service.js";
import { QueryParamSchema } from "../dto/request-dto/query-param-dto.js";
import { IdDtoSchema } from "../dto/request-dto/id-dto.js";
import { newBookDtoSchema } from "../dto/request-dto/new-book-dto.js";

export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { offset, limit } = QueryParamSchema.parse(req.query);

    const books = await bookService.getBooks(offset, limit);
    res.status(200).json({
      ok: true,
      data: books,
    });
  } catch (err) {
    next(err);
  }
};

export const getBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = IdDtoSchema.parse(req.params["id"]);
    const book = await bookService.getBook(id);
    res.status(200).json({
      ok: true,
      data: book,
    });
  } catch (err) {
    next(err);
  }
};

export const incrementWant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = IdDtoSchema.parse(req.params["id"]);
    const result = await bookService.updateWantCount(id);
    res.status(200).json({
      ok: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const addBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = newBookDtoSchema.parse(req.body);
    const result = await bookService.addBook(data);
    res.status(201).json({
      ok: true,
      id: result,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = IdDtoSchema.parse(req.params["id"]);
    const result = await bookService.deleteBook(id);
    res.status(200).json({ ok: result });
  } catch (err) {
    next(err);
  }
};
