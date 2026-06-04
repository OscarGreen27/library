import pool from "../config/postgresql-connection.js";
import { Author, AuthorSchema } from "../dto/response-dto/author-dto.js";
import z from "zod/v4";

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

export const getAuthor = async (id: number): Promise<Author> => {
  const result = await pool.query(
    `SELECT * FROM authors
        WHERE id = $1`,
    [id],
  );
  return AuthorSchema.parse(result.rows[0]);
};

export const addAuthor = async (name: string): Promise<number> => {
  const result = await pool.query(`INSERT INTO authors (name) VALUES($1) RETURNING id`, [name]);
  return z.number().parse(result.rows[0].id);
};

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
