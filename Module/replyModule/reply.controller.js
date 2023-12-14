import replyModel from "../../Database/Schema/replySchema.js";
import { client } from "../ClientModule/client.controller.js";
import fs from "fs";
import pkg from "whatsapp-web.js";
import { fileName as filename } from "../../middleware/middleware.upload.js";
const userMap = {};

const { MessageMedia } = pkg;

function reply() {
  client.on("message", (message) => {
    // Extracting sender's ID
    const clientID = message.from;
    if (!userMap[clientID]) {
      userMap[clientID] = true;
      client.sendMessage(
        clientID,
        "Hello! This is your first message. How can I assist you?"
      );
      return;
    }

    // Process other messages
    handleMessage(message);
  });
}

async function handleMessage(message) {
  const msg = await replyModel.findOne({ message: message.body });
  const PDFRegex = /\.PDF$/i;
  const imageRegex =
    /\.(PNG|JPEG|JPG|GIF|TIFF|TIF|BMP|SVG|WEBP|ICO|RAW|PSD|EPS|AI)$/i;
  const VideoRegex = /\.(MP4|AVI|MKV|WMV|MOV|FLV|MPEG|WEBM|OGV|MPG)$/i;
  if (msg) {
    if (PDFRegex.test(msg.reply)) {
      const dataBuffer = fs.readFileSync(`./media/${msg.reply}`);
      const base64PDF = dataBuffer.toString("base64");
      const media = new MessageMedia("application/pdf", base64PDF);
      client.sendMessage(message.from, media);
    } else if (imageRegex.test(msg.reply)) {
      const dataBuffer = fs.readFileSync(`./media/${msg.reply}`);
      const base64Image = dataBuffer.toString("base64");
      const media = new MessageMedia(
        `image/${msg.reply.slice(msg.reply.lastIndexOf("."))}`,
        base64Image
      );
      client.sendMessage(message.from, media);
    } else if (VideoRegex.test(msg.reply)) {
      const dataBuffer = fs.readFileSync(`./media/${msg.reply}`);
      const base64video = dataBuffer.toString("base64");
      const media = new MessageMedia(
        `video/${msg.reply.slice(msg.reply.lastIndexOf("."))}`,
        base64video
      );
      client.sendMessage(message.from, media);
    } else {
      message.reply(msg.reply);
    }
  } else {
    client.sendMessage(message.from, "please, choose option form list");
  }
}
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

export { reply, addReply, updateReply, getAllreplies };
