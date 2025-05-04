import mysql, { Connection, QueryResult, RowDataPacket } from "mysql2/promise";
import Book from "../interfaces/Book.js";
import BookRow from "../types/BookRow.js";


class Librarian {
  private connection!: Connection;

  private constructor(connection: Connection) {
    this.connection = connection;
  }

  public static async create(): Promise<Librarian> {
    const connection = await this.getConnection();
    if (!connection) {
      throw console.error("Connection error!");
    }
    return new Librarian(connection);
  }

  private static async getConnection(): Promise<Connection> {
    try {
      return await mysql.createConnection({
        host: "localhost",
        user: "librarian",
        password: "12345",
        database: "lib",
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async getAll(): Promise<Book[]> {
    try {
      const [rows] = await this.connection.execute<BookRow[]>(
        "SELECT * FROM books"
      );
      return rows;
    } catch (err) {
      throw console.error("BD is not connected!");
    }
  }

  public async addBook(newBook: Book) {
    const keys: string[] = Object.keys(newBook);
    const val: (string | number)[] = Object.values(newBook);
    await this.connection.execute(
      `INSERT INTO books (${keys.join(", ")}) VALUES (?,?,?,?,?,?)`,
      val
    );
  }

  public async getBook(id: number): Promise<BookRow> {
    try {
      const [rows, fields]  = await this.connection.execute<BookRow>(`SELECT * FROM books WHERE id = ?`, [id]);
      return rows[0];
    } catch (err) {
      throw console.error("Book id is invalid or DB connection is fals");
    }
  }
}

const lib: Librarian = await Librarian.create();

export default lib;
