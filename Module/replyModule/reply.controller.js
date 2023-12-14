import replyModel from "../../Database/Schema/replySchema.js";
import { fileName as filename } from "../../middleware/middleware.upload.js";

async function addReply(req, res) {
  try {
    if (!filename) {
      const reply = await replyModel.insertMany([req.body]);
      res.json({ message: "reply added", reply });
    } else {
      const reply = await replyModel.insertMany([
        { reply: filename, message: req.body.message },
      ]);
      res.status(200).json({ message: "media uploaded" });
    }
  } catch (error) {
    if (error.errmsg?.includes("E11000 duplicate key")) {
      res.json({
        message: "This message exists before , write unique message",
      });
    } else {
      res.json({ message: "error", error });
    }
  }
}

async function updateReply(req, res) {
  try {
    const { reply, message } = req.body;
    if (!message) {
      res.json({ message: " Enter your message" });
    } else {
      const updatedReply = await replyModel.findOneAndUpdate(
        { message },
        { reply },
        { new: true }
      );
      if (!updatedReply) {
        res.json({ message: "message not found" });
      }
      res.json({ message: "7mo", updatedReply });
    }
  } catch (error) {
    res.json({ message: "error", error });
  }
}

async function getAllreplies(req, res) {
  try {
    const allreplies = await replyModel.find();
    if (allreplies) {
      res.json({ message: "All replies", allreplies });
    } else {
      res.json({ message: " No replies founded" });
    }
  } catch (error) {
    res.json({ message: "error", error });
  }
}

export { addReply, updateReply, getAllreplies };
