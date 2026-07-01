import dotenv from "dotenv";
import pool from "../config/postgresql-connection.js";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { NotFoundError } from "../errors/app-errors.js";

dotenv.config();

const MAIN_UPLOADS_PATH = process.env["MAIN_UPLOADS_PATH"] || ".uploads/book-lib/covers/";
const COVERS_DIRECTORY_PATH = path.join(os.homedir(), MAIN_UPLOADS_PATH);

/**
 * Sets a cover image for a book.
 *
 * Confirms the existence of the book. Creates a folder for the cover and moves the cover from temporary storage to permanent storage.
 * Clears the cover directory if it already exists.
 * After copying to permanent storage, the cover is removed from temporary storage.
 * @param file file saved to temporary storage
 * @param id Book id
 * @returns true if it does not cause an error during execution
 */
export const setCover = async (file: Express.Multer.File, id: number) => {
  await isBookIdExists(id);

  const bookCoverDirectory = path.join(COVERS_DIRECTORY_PATH, String(id));

  const createdDirectory = await fsp.mkdir(bookCoverDirectory, { recursive: true });

  if (!createdDirectory) {
    await clearCoverDirectory(bookCoverDirectory);
  }

  await fsp.copyFile(file.path, path.join(bookCoverDirectory, file.filename));
  await fsp.unlink(file.path);
};

/**
 * Removes the book cover
 *
 * Checks for the existence of a book by id.
 * Forms the path to the directory with the cover.
 * Clears the directory
 * @param id Book id
 * @returns true if it does not cause an error during execution
 */
export const deleteCover = async (id: number) => {
  await isBookIdExists(id);

  const directoryToClear = path.join(COVERS_DIRECTORY_PATH, String(id), "/");

  await clearCoverDirectory(directoryToClear);
};

/**
 * Returns the path to the book cover
 *
 * Checks if the contents of the directory are empty, returns an error if it is empty
 *
 * @param id Book id
 * @returns the path to the cover
 */
export const getCover = async (id: number): Promise<string> => {
  await isBookIdExists(id);

  const coverDirPath = path.join(COVERS_DIRECTORY_PATH, String(id));
  const directoryContents = await fsp.readdir(coverDirPath);

  if (!directoryContents[0]) {
    throw new NotFoundError(`No covers found for book with id: ${id}`);
  }

  return path.join(coverDirPath, directoryContents[0]);
};

//////////internal module functions//////////
/**
 * Deletes files from a directory
 * @param directoryToClear path to directory to be cleaned
 */
async function clearCoverDirectory(directoryToClear: string) {
  const files = await fsp.readdir(directoryToClear);
  if (files.length > 0) {
    for (const file of files) {
      await fsp.unlink(path.join(directoryToClear, file));
    }
  }
}

/**
 * Checks if a Book exists in the database by id
 * @param id Book id
 * @throws NotFoundError if id does not match the entry in the database
 */
async function isBookIdExists(id: number) {
  const result = await pool.query("SELECT EXISTS (SELECT 1 FROM books WHERE id=$1)", [id]);
  if (!result.rows[0].exists) {
    throw new NotFoundError(`Book with id ${id} not found`);
  }
}
