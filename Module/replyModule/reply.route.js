import express from "express";
import { addReply, getAllreplies, updateReply } from "./reply.controller.js";

const replyRouter = express.Router();

replyRouter.post("/add", addReply);
replyRouter.patch("/update", updateReply);
replyRouter.get("/all", getAllreplies);


export { replyRouter };