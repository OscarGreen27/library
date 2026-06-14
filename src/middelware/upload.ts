import multer, { FileFilterCallback, MulterError } from "multer";
import fsSync from "fs";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

//middleware responsible for saving images
export const upload = multer({
  /**
   * Image is saved to a temporary folder for later movement.
   * After checking the existence of the book id, the file will be moved to the appropriate folder
   */
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      try {
        const TEMP_COVER_PATH = process.env["TEMP_COVER_PATH"] || "/tmp/upload/lib-cover";

        if (!fsSync.existsSync(TEMP_COVER_PATH)) {
          fsSync.mkdirSync(TEMP_COVER_PATH, { recursive: true });
        }
        cb(null, TEMP_COVER_PATH);
      } catch (err) {
        if (err instanceof Error || err instanceof MulterError) {
          cb(err, "");
        }
      }
    },
    filename: (req, file, cb) => {
      try {
        if (typeof req.query["id"] !== "string" || !/^\d+$/.test(req.query["id"])) {
          throw new Error("ID is invalid");
        }

        const name = Date.now() + "-cover-" + req.query["id"] + "-" + Math.round(Math.random() * 1e9);

        cb(null, name + path.extname(file.originalname));
      } catch (err) {
        if (err instanceof Error || err instanceof MulterError) {
          cb(err, "");
        }
      }
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeType = ["image/jpeg", "image/png", "image/webp"];
    if (allowedMimeType.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not supported`));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * Number(process.env["FILE_SIZE"]) || 5,
    files: Number(process.env["FILES"]) || 1,
    fields: Number(process.env["FIELDS"]) || 1,
    parts: Number(process.env["PARTS"]) || 2,
    fieldNameSize: Number(process.env["FIELD_NAME_SIZE"]) || 15,
  },
});
