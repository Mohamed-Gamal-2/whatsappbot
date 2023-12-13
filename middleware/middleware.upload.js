import multer from "multer";
import path from "path";

let fileName;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(
        "D:/Software Eng/Projects/Self-Working Projects/whatsappbot/media"
      )
    );
  },
  filename: function (req, file, cb) {
    fileName = new Date().toISOString().replace(/:/g, "-") + file.originalname;
    cb(null, fileName);
  },
});

const uploadMedia = multer({ storage }).single("media");

const uploadingMediaMW = (req, res, next) => {
  const newUploadMediaInstance = uploadMedia;

  newUploadMediaInstance(req, res, function (err) {
    console.log({ fileName });

    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: "Something went wrong!" });
    }
    next();
  });
};

export { uploadingMediaMW, fileName };
