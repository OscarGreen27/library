import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import dotenv from "dotenv";
import pool, { testDbConnection } from "./config/postgresql-connection.js";
import session from "express-session";
import bookRouter from "./routers/book-router.js";
import authorRouter from "./routers/author-router.js";
import userRouter from "./routers/user-router.js";
import { errorHandler } from "./middelware/error-handler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicPath = path.join(__dirname, "..", "public");

dotenv.config();

const app = express();

app.use("/public", express.static(publicPath));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Отримано запит: ${req.method} ${req.url}`);
  next();
});

app.use(
  session({
    secret: "super-secret-word",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 600000,
    },
  }),
);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/author", authorRouter);
app.use("/api/v1", userRouter);

app.use(errorHandler);

const PORT = process.env["APP_PORT"];
app.listen(PORT, async (error) => {
  testDbConnection();
  if (error) {
    console.log(`Server start fail, error: ${error}`);
    process.exit(1);
  }
  console.log(`Server listening port: ${PORT}`);
});
