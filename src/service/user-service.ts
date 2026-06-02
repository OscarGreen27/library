import * as bcrypt from "bcrypt-ts";
import pool from "../config/postgresql-connection.js";
import { UserAuthentification } from "../dto/request-dto/user-authentification-dto.js";
import { UserRegistration } from "../dto/request-dto/user-registration-dto.js";
import dotenv from "dotenv";
import { UserSessionData } from "../types/user-session-data.js";

dotenv.config();

export const createUser = async (
  newUser: UserRegistration,
): Promise<number> => {
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

  return result.rows[0].id;
};

export const login = async (
  data: UserAuthentification,
): Promise<UserSessionData> => {
  const { email, password } = data;

  const result = await pool.query(
    "SELECT id, hash, role FROM users WHERE email=$1",
    [email],
  );
  if (!result.rows[0]) {
    throw new Error("Email/password combination error!");
  }
  const { hash, ...userSessionData } = result.rows[0];

  const isPasswordCorrect = await bcrypt.compare(password, hash);
  if (!isPasswordCorrect) {
    throw new Error("Email/password combination error!");
  }
  return userSessionData;
};
