import dotenv from "dotenv";
import { newBook } from "../dto/request-dto/new-book-dto.js";
import { Book, BookSchema } from "../dto/response-dto/book-dto.js";
import z from "zod/v4";
import pool from "../config/postgresql-connection.js";
import { NotFoundError } from "../errors/app-errors.js";

dotenv.config();

/**
 * Executes a query to the database to retrieve the Book array.
 * Validates the received data and then returns the result
 * @param offset number of elements to skip
 * @param limit max number of elements to return
 * @returns Book[] or [] if the data received from the database did not pass validation
 */
export const getBooks = async (offset: number, limit: number): Promise<Book[]> => {
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
 * Queries the database for a single Book element.
 * Validates the result obtained from the database, if the validation is successful, returns the result obtained
 * @param id Book ID
 * @returns  Book
 * @throws Error if the data received from the database does not match the parsing parameters or the book is not found
 */
export const getBook = async (id: number): Promise<Book> => {
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
    throw new NotFoundError(`Book with id ${id} not found`);
  }

  await pool.query(`UPDATE clicks SET "clicks_count" = "clicks_count" + 1 WHERE book_id = $1`, [id]);

  return book.data;
};

/**
 * Executes a query to iterate the counter.
 *
 * @param bookId Book id
 * @returns counter
 */
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
 * Prepares the received data for inserting new data into the database.
 * Separates the array of author ids from the book data,
 * splits the object into keys and properties, creates a placeholder for the database query.
 * Passes the separated data for insertion
 *
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
 * Executes a transaction to delete book information from the database.
 * @param id Book id
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

/**
 * Executes a query to insert data about a new book into the database.
 * After inserting data about a new book, returns the id.
 * Makes entries with the id of the new book in the required tables
 * @param keys list of book table fields ()
 * @param values information about the new book (title, description, year of publication...)
 * @param placeholders  string template example "$1, $2, $3,..."
 * @param authors author id array
 * @returns new Book id
 */
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
    await client.query(
      `INSERT INTO book_author (book_id, author_id)
      SELECT $1, unnest($2::int[])`,
      [bookId, authors],
    );
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

/**
 * Checks whether the input argument is a positive integer.
 * Throws an error if the argument is not a positive integer.
 * @param num - unknown
 * @returns input param if it is positive integer
 */
function isPositiveInteger(num: unknown): number {
  return z.number().int().positive().parse(num);
}
