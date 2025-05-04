import express, { Request, Response } from "express";
import path from "path";
import fsPromises from "fs/promises";
import lib from "../model/Librarian.js";
import * as cheerio from "cheerio";
import Book from "../interfaces/Book.js";

const router = express.Router();

const MAIN_PAGE = path.resolve(process.cwd(), "public", "books-page.html");
const BOOK_PAGE = path.resolve(process.cwd(), "public", "book-page.html");

router.get("/", async (req: Request, res: Response) => {
  const allBook = await lib.getAll();
  const indexHtml = await fsPromises.readFile(MAIN_PAGE, "utf-8");

  const $ = cheerio.load(indexHtml);

  const $content = $("#content");

  allBook.forEach((book) => {
    const bookElem = `
          <div class="book_item col-xs-6 col-sm-3 col-md-2 col-lg-2" data-book-id="${book.id}">
            <div class="book">
              <a href="/book/${book.id}">
                <img src="{img}" alt="${book.title}">
                <div class="blockI" style="height: 46px;">
                  <div class="title size_text">${book.title}</div>
                  <div class="author">${book.author}</div>
                </div>
              </a>
              <a href="/book/${book.id}">
                <button type="button" class="details btn btn-success">Читать</button>
              </a>
            </div>
          </div>
      `;
    $content.append(bookElem);
  });

  res.send($.html());
});

router.get("/book/:id", async (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  const book: Book = await lib.getBook(id);
  const data = await fsPromises.readFile(BOOK_PAGE, "utf-8");

  const $ = cheerio.load(data);

  $("#title").text(book.title);
  $("#author").text(book.author);
  $("#year").text(String(book.year));
  $("#pages").text(String(book.pages));
  $("#isbn").text(String(book.isbn));
  $("#description").text(String(book.description));

  res.send($.html());
});

export default router;
