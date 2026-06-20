import express from "express";
import * as authorController from "../controllers/author-controller.js";
import { authorize } from "../middleware/auth-check.js";

const authorRouter = express.Router();

authorRouter.get("/all", authorize("user"), authorController.getAuthors);
authorRouter.get("/:id", authorize("user"), authorController.getAuthor);
authorRouter.post("/add", authorize("admin"), authorController.addAuthor);
authorRouter.delete("/delete/:id", authorize("admin"), authorController.deleteAuthor);

export default authorRouter;
