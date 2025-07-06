import * as cheerio from "cheerio";
import { BookDto } from "../model/books_schema.js";

/**
 * The render class uses the Cheerio library to create the PDP.
 */
export class Render {
  /**
   * The function is responsible for creating a PDP for a separate book.
   * @param data an array with an object whose fields contain book data
   * @param rawPage html page
   * @returns html page with book information
   */
  public getBookPage(data: BookDto[], rawPage: string): string {
    const $ = cheerio.load(rawPage);
    const book = data[0];
    if (!book) {
      throw new Error("Book is invalid!");
    }
    $("#id").attr("book-id", `${String(book.id)}`);
    $("#title").text(book.title);
    $("#author").text(book.author);
    $("#year").text(String(book.year));
    $("#pages").text(String(book.pages));
    $("#isbn").text(String(book.isbn));
    $("#description").text(String(book.description));
    $("#book-cover").attr("src", "../public/images/" + String(book.cover));

    return $.html();
  }
}
