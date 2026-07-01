import * as bcrypt from "bcrypt-ts";
import pool from "../config/postgresql-connection.js";
import { UserAuthentification } from "../dto/request-dto/user-authentification-dto.js";
import { UserRegistration } from "../dto/request-dto/user-registration-dto.js";
import z from "zod/v4";
import dotenv from "dotenv";
import { UserSessionData, UserSessionDataSchema } from "../types/user-session-data.js";
import { ConflictError, UnauthorizedError } from "../errors/app-errors.js";

dotenv.config();

/**
 * Function for registering a new user.
 * Checks if the user's email is unique.
 * Encrypts the user's password.
 * The new user's data is split into keys and values ​​for dynamic query generation.
 * During the split, the "password" field is renamed to "hash" to match the fields in the database.
 * Executes an insert query with prepared data
 *
 * @param newUser
 * @returns new user id
 */
export const createUser = async (newUser: UserRegistration): Promise<string> => {
  const isEmailFree = await pool.query("SELECT EXISTS(SELECT 1 FROM users WHERE email=$1)", [newUser.email]);
  if (isEmailFree.rows[0].exists) {
    throw new ConflictError("Email already in use");
  }
  const salt = await bcrypt.genSalt(Number(process.env["SALT"]));
  newUser.password = await bcrypt.hash(newUser.password, salt);

  const keys = Object.keys(newUser);
  const index = keys.indexOf("password");
  keys[index] = "hash";
  const values = Object.values(newUser);
  const placeholders = keys.map((_, index) => `$${index + 1}`).join(", ");

  const result = await pool.query(
    `INSERT INTO users (${keys.join(",")}) VALUES (${placeholders}) RETURNING id`,
    values,
  );

  return z.string().parse(result.rows[0].id);
};

/**
 * Authorization function.
 * Searches for the user's email.
 * Compares the received password with the hash in the database.
 * Returns an error if the email is not found or the password is incorrect
 * @param data UserAuthentificationDto
 * @returns UserSessionData
 */
export const login = async (data: UserAuthentification): Promise<UserSessionData> => {
  const { email, password } = data;

  const result = await pool.query("SELECT id, hash, role FROM users WHERE email=$1", [email]);

  if (!result.rows[0]) {
    throw new UnauthorizedError("Email/password combination error!");
  }
  const { hash, ...userSessionData } = result.rows[0];

  const isPasswordCorrect = await bcrypt.compare(password, hash);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Email/password combination error!");
  }
  return UserSessionDataSchema.parse(userSessionData);
};
