import express from "express";
import multer from "multer";
import path from "path"
import { addReply, getAllreplies, updateReply } from "./reply.controller.js";
import { validateHeaderName } from "http";
import { uploadingMediaMW } from "../../middleware/middleware.upload.js";

const replyRouter = express.Router();

// upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("E:/web-project/whatsapp bot/whatsappbot/media"));
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g,"-") + file.originalname);
  },
  description
});
const uploadMedia = multer({ storage });
replyRouter.post("/add", uploadingMediaMW, addReply);
replyRouter.patch("/update", updateReply);
replyRouter.get("/all", getAllreplies);
// replyRouter.post("/upload", uploadMedia.single("media"), uploadingMedia);

export { replyRouter };
