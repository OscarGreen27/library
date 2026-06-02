import express from "express";
import validateId from "../middelware/id-validator.js";
import * as bookController from "../controllers/book-controller.js";


const authorRouter = express.Router();

authorRouter.get("/books", bookController.getAllBooks);
authorRouter.get("/book/:id", validateId, bookController.getBook);
authorRouter.post("/book/add", bookController.addBook);
authorRouter.put("/book/want/:id", validateId, bookController.incrementWant);
authorRouter.delete("book/delete/:id", validateId, bookController.deleteBook);


export default authorRouter;


