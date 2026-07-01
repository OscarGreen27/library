import pool from "../config/postgresql-connection.js";
import { Author, AuthorSchema } from "../dto/response-dto/author-dto.js";
import z from "zod/v4";
import { NotFoundError } from "../errors/app-errors.js";

/**
 * Executes a database query to retrieve the Author array.
 * Validates data received from the database and returns the result
 * @param offset number of elements to skip
 * @param limit max number of elements to return
 * @returns Author[] if query result is valid, [] if not
 */
export const getAuthors = async (offset: number, limit: number): Promise<Author[]> => {
  const result = await pool.query(
    `SELECT * FROM authors
        LIMIT $1 OFFSET $2`,
    [limit, offset],
  );
  const authors = z.array(AuthorSchema).safeParse(result.rows);
  if (!authors.success) {
    return [];
  }
  return authors.data;
};

/**
 * Queries the database to retrieve one record for the received author.
 * Validates data and returns the result.
 * If the data from the database does not pass validation, it throws an error.
 * @param id Author id
 * @returns Author
 */
export const getAuthor = async (id: number): Promise<Author> => {
  const result = await pool.query(
    `SELECT * FROM authors
        WHERE id = $1`,
    [id],
  );

  const author = AuthorSchema.safeParse(result.rows[0]);
  if (!author.success) {
    throw new NotFoundError(`Author with id ${id} not found`);
  }
  return author.data
};

/**
 * Executes a query that inserts information about the new author
 *
 * @param name New author name
 * @returns new Author id
 */
export const addAuthor = async (name: string): Promise<number> => {
  const result = await pool.query(`INSERT INTO authors (name) VALUES($1) RETURNING id`, [name]);
  return z.number().parse(result.rows[0].id);
};

/**
 * Executes a transaction to delete author information from the main table and the related table
 *
 * @param id Author id of which you want to delete
 * @returns true if the author was deleted, false if the deletion failed
 */
export const deleteAuthors = async (id: number): Promise<boolean> => {
  const client = await pool.connect();

  try {
    //1. Start transaction
    await client.query(`BEGIN`);
    //2. Delete relationship
    await client.query(`DELETE FROM book_author WHERE author_id = $1`, [id]);
    //3. Delete author
    const result = await client.query(`DELETE FROM authors WHERE id = $1`, [id]);
    //4. End transaction
    await client.query("COMMIT");
    if (typeof result.rowCount === "number") {
      return result.rowCount > 0;
    }
    return false;
  } catch (err) {
    if (client) {
      try {
        await client.query(`ROLLBACK`);
      } catch (rollbackErr) {
        console.error("Failde to rollback!", rollbackErr);
        throw rollbackErr;
      }
    }
    throw err;
  } finally {
    client?.release();
  }
};
