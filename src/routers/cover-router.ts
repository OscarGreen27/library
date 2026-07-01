import express from "express";
import { upload } from "../middleware/upload.js";
import * as coverController from "../controllers/cover-controller.js";
import { authorize } from "../middleware/auth-check.js";

const coverRouter = express.Router();

coverRouter.get("",authorize(['admin', 'user']), coverController.getCover);

coverRouter.post("/upload", authorize(['admin']), upload.single("cover"), coverController.addCover);
coverRouter.delete("/delete", authorize(['admin']), coverController.deleteCover);

export default coverRouter;
