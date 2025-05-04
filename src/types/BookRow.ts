import { QueryResult, RowDataPacket } from "mysql2/promise";
import Book from "../interfaces/Book.js";

type BookRow = Book & RowDataPacket & QueryResult;

export default BookRow;