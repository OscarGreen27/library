import express from "express";
import validateId from "../middelware/id-validator.js";
import * as bookController from "../controllers/book-controller.js";
import { authorize } from "../middelware/auth-check.js";

const bookRouter = express.Router();

bookRouter.get("/all", authorize("user"), bookController.getAllBooks);
bookRouter.get("/:id", authorize("user"), validateId, bookController.getBook);
bookRouter.post("/add", authorize("admin"), authorize, bookController.addBook);
bookRouter.put("/want/:id", authorize("admin"), validateId, bookController.incrementWant);
bookRouter.delete("/delete/:id", authorize("admin"), validateId, bookController.deleteBook);

export default bookRouter;
