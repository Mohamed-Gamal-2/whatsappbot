import multer from "multer";
import path from "path";
import fs from "fs/promises";
import replyModel from "../Database/Schema/replySchema.js";

let fileName;
let fileNameinstance;
const uploadingMediaMW = (req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.resolve("./media")));
    },
    filename: function (req, file, cb) {
      fileName = file.originalname;
      cb(null, fileName);
    },
  });
  const uploadMedia = multer({ storage }).single("media");
  const newUploadMediaInstance = uploadMedia;
  newUploadMediaInstance(req, res, async function (err) {
    if (fileName) {
      try {
        fileNameinstance = fileName;
        const fileFounded = await replyModel.findOne({ message: fileName });
        if (fileFounded) {
          const filePath = path.resolve(`./media/${fileName}`);
          await fs.unlink(filePath);
        }
      } catch (err) {
        console.error("Error deleting file:", err);
      }
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ error: err.message });
      }
      fileName = "";
      next();
    } else {
      fileNameinstance = "";
      next();
    }
  });
};
export { uploadingMediaMW, fileNameinstance };
