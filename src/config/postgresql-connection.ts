import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  host: process.env["DB_HOST"],
  port: Number(process.env["DB_PORT"]) || 5432,
  database: process.env["DB_NAME"],
  user: process.env["DB_USER"],
  password: process.env["DB_PASS"],
});

export const testDbConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("Connnected to BD succssfully!");
    client.release();
  } catch (err) {
    console.error("DB connection error!", err);
    process.exit(1);
  }
};

export default pool;
