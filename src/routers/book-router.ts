import express from "express";
import * as bookController from "../controllers/book-controller.js";
import { authorize } from "../middleware/auth-check.js";

const bookRouter = express.Router();

bookRouter.get("/all", authorize("user"), bookController.getAllBooks);
bookRouter.get("/:id", authorize("user"), bookController.getBook);
bookRouter.post("/add", authorize("admin"), bookController.addBook);
bookRouter.put("/want/:id", authorize("admin"), bookController.incrementWant);
bookRouter.delete("/delete/:id", authorize("admin"), bookController.deleteBook);

export default bookRouter;
