import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import router from "./controller/router.js";
import adminRouter from "./controller/admin_router.js";

const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicPath = path.join(__dirname, "..", "public");

const app = express();

app.use("/public", express.static(publicPath));
app.use(express.json());
app.use(router);
app.use(adminRouter);

app.listen(PORT, (error) => {
  if (error) {
    console.log(`Server start fail, error: ${error}`);
    process.exit(1);
  }
  console.log(`Server listening port: ${PORT}`);
});
