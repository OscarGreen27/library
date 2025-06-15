import mysql, {
  Connection,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";
import dotenv from "dotenv";
import { BookDto, BookSchema } from "./books_schema.js";

dotenv.config();

//the class is responsible for working with the database
class Librarian {
  private connection!: Connection;

  private constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * method creates a connection to the database
   * @returns instance of the Librarian class
   */
  public static async create(): Promise<Librarian> {
    try {
      const connection = await this.getConnection();
      return new Librarian(connection);
    } catch (err) {
      throw err;
    }
  }

  /**
   * connection method to the database
   * @returns connection
   */
  private static async getConnection(): Promise<Connection> {
    const DB_HOST = process.env["DB_HOST"];
    const DB_NAME = process.env["DB_NAME"];
    const DB_USER = process.env["DB_USER"];
    const DB_PASS = process.env["DB_PASS"];

    if (!DB_HOST || !DB_NAME || !DB_PASS || !DB_USER) {
      throw new Error(
        "Server configuration parameters is undefined! Check env file."
      );
    }
    try {
      return await mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  /**
   * The method queries the database to retrieve all records.
   * @returns array with book objects
   */
  public async getAllBooks(): Promise<BookDto[]> {
    try {
      const [rows] = await this.connection.execute<RowDataPacket[]>(
        "SELECT * FROM books"
      );
      return this.parseBooks(rows);
    } catch (err) {
      throw new Error("Database connection failed");
    }
  }

  /**
   * The method queries the database to retrieve a record of a single book.
   * @param id book id
   * @returns a single-element array containing a book object
   */
  public async getBook(id: number): Promise<BookDto[]> {
    try {
      const [rows] = await this.connection.execute<RowDataPacket[]>(
        `SELECT * FROM books WHERE id = ?`,
        [id]
      );

      const books = this.parseBooks(rows);

      if (books.length === 0) {
        throw new Error(`Book with id:${id} not found!`);
      } else {
        await this.connection.execute(
          `UPDATE books SET numbersOfView = numbersOfView + 1 WHERE id = ?`,
          [id]
        );
      }
      return books;
    } catch (err) {
      throw new Error("Book id is invalid or DB connection is fals");
    }
  }
  /**
   * The method queries the database to add a new book.
   * @param newBook an object that contains data about a new book
   * @returns new book id
   */
  public async addBook(newBook: BookDto): Promise<number> {
    const validated = BookSchema.safeParse(newBook);

    if (!validated.success) {
      console.error("Invalid book format:", validated.error.format());
      throw new Error("Invalid book data");
    }

    const book = validated.data;
    const keys: (keyof BookDto)[] = [
      "title",
      "year",
      "author",
      "pages",
      "isbn",
      "description",
      "cover",
    ];
    const values = keys.map((key) => book[key]);
    const [result] = await this.connection.execute<ResultSetHeader>(
      `INSERT INTO books (${keys.join(", ")}) VALUES (?,?,?,?,?,?,?)`,
      values
    );
    return result.insertId;
  }
  /**
   * The method queries the database to delete the book.
   * @param id ID of the book you want to delete
   * @returns true if the book is deleted, false if not deleted
   */
  public async deleteBook(id: number): Promise<boolean> {
    try {
      const [result] = await this.connection.execute<ResultSetHeader>(
        "DELETE FROM books WHERE id = ?",
        [id]
      );

      return result.affectedRows > 0;
    } catch (err) {
      throw new Error("Deletin failed!");
    }
  }
  /**
   * The method changes the data type from string to number in the year, pages, isbn fields of the book object.
   * @param raw object book received from client
   * @returns object of type BookDto
   */
  public normalizedBook(raw: Record<string, string>): BookDto {
    return BookSchema.parse({
      title: raw["title"],
      year: this.isNumber(raw["year"]),
      author: raw["author"],
      pages: this.isNumber(raw["pages"]),
      isbn: this.isNumber(raw["isbn"]),
      description: raw["description"],
    });
  }

  /**
   * Increments the wantCount field by 1 for the book with the corresponding id
   * @param id The ID of the book
   * @returns true if the book was updated
   */
  public async incrementWantCount(id: number): Promise<boolean> {
    try {
      const [result] = await this.connection.execute<ResultSetHeader>(
        `UPDATE books SET wantCount = wantCount + 1 WHERE id = ?`,
        [id]
      );

      return result.affectedRows > 0;
    } catch (err) {
      throw new Error("Failed to increase counter add to wishlist");
    }
  }

  private parseBooks(rows: RowDataPacket[]): BookDto[] {
    const validBooks: BookDto[] = [];

    for (const row of rows) {
      const parsed = BookSchema.safeParse(row);
      if (parsed.success) {
        validBooks.push(parsed.data);
      }
    }
    return validBooks;
  }

  private isNumber(param: any): number {
    if (!isNaN(Number(param))) {
      return Number(param);
    }
    return 0;
  }
}

/**
 * A single instance of the librarian class is created and imported from the module to provide a single connection tone.
 */
const lib: Librarian = await Librarian.create();

export default lib;
