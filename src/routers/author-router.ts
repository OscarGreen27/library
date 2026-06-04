import express from "express";
import validateId from "../middelware/id-validator.js";
import * as authorController from "../controllers/author-controller.js";
import { authorize } from "../middelware/auth-check.js";

const authorRouter = express.Router();

authorRouter.get("/all", authorize("user"), authorController.getAuthors);
authorRouter.get("/:id", authorize("user"), validateId, authorController.getAuthor);
authorRouter.post("/add", authorize("admin"), authorController.addAuthor);
authorRouter.delete("/delete/:id", authorize("admin"), validateId, authorController.deleteAuthor);

export default authorRouter;
