import express from "express";
import { addReply, getAllreplies, updateReply } from "./reply.controller.js";
import { uploadingMediaMW } from "../../middleware/middleware.upload.js";

const replyRouter = express.Router();

replyRouter.post("/add", uploadingMediaMW, addReply);
replyRouter.patch("/update", updateReply);
replyRouter.get("/all", getAllreplies);
// replyRouter.post("/upload", uploadMedia.single("media"), uploadingMedia);

export { replyRouter };
