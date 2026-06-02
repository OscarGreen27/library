import express from "express";
import validateId from "../middelware/id-validator.js";
import * as bookController from "../controllers/book-controller.js";

const bookRouter = express.Router();

bookRouter.get("/all", bookController.getAllBooks);
bookRouter.get("/:id", validateId, bookController.getBook);
bookRouter.post("/add", bookController.addBook);
bookRouter.put("/want/:id", validateId, bookController.incrementWant);
bookRouter.delete("/delete/:id", validateId, bookController.deleteBook);


export default bookRouter;
