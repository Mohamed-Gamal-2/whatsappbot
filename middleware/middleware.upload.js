import multer from "multer";
import path from "path";
import fs from "fs/promises"; // Import fs.promises instead of node:fs/promises

let fileName;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.resolve(
        "../whatsappbot/media"
      )));
  },
  filename: function (req, file, cb) {
    // fileName = new Date().toISOString().replace(/:/g, "-") + file.originalname;
    fileName =  file.originalname;
    cb(null, fileName);
  },
});
const uploadMedia = multer({ storage }).single("media");

const uploadingMediaMW =  (req, res, next) => {
  // Make the middleware async
  const newUploadMediaInstance = uploadMedia;
  newUploadMediaInstance(req, res, async function (err) {
    try {
      console.log({ fileName });
      // const filePath = `E:/web-project/whatsapp bot/whatsappbot/media/${fileName}`;
      // const filePath = path.resolve(`../whatsappbot/media/${fileName}`);
      console.log(filePath);

      // await fs.unlink(filePath); 

      console.log("Successfully deleted filePath");
    } catch (err) {
      console.error("Error deleting file:", err);
    }
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: err.message });
    }
    next();
  });
};

export { uploadingMediaMW, fileName };
