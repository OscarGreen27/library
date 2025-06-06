import multer from "multer";
import path from "path";

//middleware responsible for saving images
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const imgPath = path.resolve(process.cwd(), "public", "images");
      console.log(process.cwd);
      console.log(imgPath);
      cb(null, imgPath);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = Math.round(Math.random() * 1e9) + ext;
      cb(null, uniqueName);
    },
  }),
});

export default upload;
