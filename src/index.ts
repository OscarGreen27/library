import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import router from "./controller/router.js";
import adminRouter from "./controller/admin_router.js";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicPath = path.join(__dirname, "..", "public");

dotenv.config({ path: ".env" });

const app = express();

app.use("/public", express.static(publicPath));
app.use(express.json());
app.use(router);
app.use(adminRouter);

const PORT = process.env["SERVER_PORT"];
app.listen(PORT, (error) => {
  if (error) {
    console.log(`Server start fail, error: ${error}`);
    process.exit(1);
  }
  console.log(`Server listening port: ${PORT}`);
});
