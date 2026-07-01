import express from "express";
import dotenv from "dotenv";
import { testDbConnection } from "./config/postgresql-connection.js";
import session from "express-session";
import bookRouter from "./routers/book-router.js";
import authorRouter from "./routers/author-router.js";
import userRouter from "./routers/user-router.js";
import coverRouter from "./routers/cover-router.js";
import { errorHandler } from "./middleware/error-handler.js";
import { getSeesionConfig } from "./config/session-config.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Отримано запит: ${req.method} ${req.url}`);
  next();
});

app.use(session(getSeesionConfig()));

app.use("/api/v1/book", bookRouter);
app.use("/api/v1/author", authorRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1/cover", coverRouter);

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
