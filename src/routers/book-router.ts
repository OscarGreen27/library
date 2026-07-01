import express from "express";
import * as bookController from "../controllers/book-controller.js";
import { authorize } from "../middleware/auth-check.js";

const bookRouter = express.Router();

bookRouter.get("/all", authorize(["user", "admin"]), bookController.getAllBooks);
bookRouter.get("/:id", authorize(["user", "admin"]), bookController.getBook);
bookRouter.put("/want/:id", authorize(["user", "admin"]), bookController.incrementWant);

bookRouter.post("/add", authorize(["admin"]), bookController.addBook);
bookRouter.delete("/delete/:id", authorize(["admin"]), bookController.deleteBook);

export default bookRouter;
