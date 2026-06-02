import dotenv from "dotenv";
import { newBook } from "../dto/request-dto/new-book-dto.js";
import { Book, BookSchema } from "../dto/response-dto/book-dto.js";
import z from "zod/v4";
import pool from "../config/postgresql-connection.js";

dotenv.config();

/**
 *
 * @param offset
 * @param limit
 * @returns array of books(Book[]) if the data received from the database has passed validation, otherwise an empty array is returned
 */
export const getBooks = async (
  offset: number,
  limit: number,
): Promise<Book[]> => {
  const result = await pool.query(
    `SELECT books.*, json_agg(authors.name) AS authors FROM books 
      LEFT JOIN book_author ON books.id = book_author.book_id 
      LEFT JOIN authors ON book_author.author_id = authors.id 
      GROUP BY books.id 
      ORDER BY books.id 
      LIMIT $1 OFFSET $2;`,
    [limit, offset],
  );

  const books = z.array(BookSchema).safeParse(result.rows);
  if (!books.success) {
    return [];
  }
  return books.data;
};

/**
 * The method queries the database to retrieve a record of a single book.
 * @param id book id
 * @returns a single-element array containing a book object
 */
export const getBook = async (id: number): Promise<Book | string> => {
  const result = await pool.query(
    `SELECT books.*, json_agg(authors.name) AS authors FROM books 
      LEFT JOIN book_author ON books.id = book_author.book_id 
      LEFT JOIN authors ON book_author.author_id = authors.id
      WHERE books.id = $1
      GROUP BY books.id 
      ORDER BY books.id`,
    [id],
  );

  const book = BookSchema.safeParse(result.rows[0]);
  if (!book.success) {
    return " ";
  }

  await pool.query(
    `UPDATE clicks SET "clicks_count" = "clicks_count" + 1 WHERE book_id = $1`,
    [id],
  );

  return book.data;
};

export const updateWantCount = async (bookId: number): Promise<number> => {
  const result = await pool.query(
    `UPDATE want SET "want_count" = "want_count" + 1
     WHERE book_id = $1
     RETURNING want_count`,
    [bookId],
  );
  if (!!!result.rows.length) {
    return 0;
  }
  return isPositiveInteger(result.rows[0].want_count);
};

/**
 * The method queries the database to add a new book.
 * @param newBook an object that contains data about a new book
 * @returns new book id
 */
export const addBook = async (data: newBook): Promise<number> => {
  const { authors, ...newBook } = data;

  const keys = Object.keys(newBook);
  const values = Object.values(newBook);
  const placeholders = keys.map((_, index) => `$${index + 1}`).join(", ");

  return await insertNewBook(keys, values, placeholders, authors);
};

/**
 * The method queries the database to delete the book.
 * @param id ID of the book you want to delete
 * @returns true if the book is deleted, false if not deleted
 */
export const deleteBook = async (id: number): Promise<boolean> => {
  const client = await pool.connect();
  try {
    //1. Start transaction
    await client.query("BEGIN");
    // 2.Delet dependency
    await client.query(`DELETE FROM book_author WHERE book_id = $1`, [id]);
    await client.query(`DELETE FROM clicks WHERE book_id =$1`, [id]);
    await client.query(`DELETE FROM want WHERE book_id = $1`, [id]);

    // 3.Delete book
    const result = await client.query(`DELETE FROM books WHERE id = $1`, [id]);

    //3. End transaction
    await client.query("COMMIT");

    if (typeof result.rowCount === "number") {
      return result.rowCount > 0;
    }
    return false;
  } catch (err) {
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackErr) {
        console.error("Failed to rollback:", rollbackErr);
      }
    }
    throw err;
  } finally {
    client?.release();
  }
};

async function insertNewBook(
  keys: string[],
  values: (string | number)[],
  placeholders: string,
  authors: number[],
): Promise<number> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    //1. Insert new book
    const bookRes = await client.query(
      `INSERT INTO books (${keys.join(", ")}) VALUES (${placeholders}) RETURNING id`,
      values,
    );
    const bookId: number = bookRes.rows[0].id;

    //2. Making new relations between authors and books
    for (const authorId of authors) {
      await client.query(
        `INSERT INTO book_author (book_id, author_id) VALUES ($1, $2)`,
        [bookId, authorId],
      );
    }
    //3. Insert new book id into want and click tables
    await client.query(`INSERT INTO want (book_id) VALUES ($1) `, [bookId]);
    await client.query(`INSERT INTO clicks (book_id) VALUES ($1) `, [bookId]);

    await client.query("COMMIT");

    return isPositiveInteger(bookId);
  } catch (err) {
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackErr) {
        console.error("Failed to rollback:", rollbackErr);
      }
    }
    throw err;
  } finally {
    client?.release();
  }
}

function isPositiveInteger(num: any) {
  const schema = z.number().int().positive();
  const result = schema.safeParse(num);
  return 1;
}
