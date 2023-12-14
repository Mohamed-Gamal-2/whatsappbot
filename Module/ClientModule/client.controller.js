import QRCode from "qrcode";
import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
import fs from "fs";
import replyModel from "../../Database/Schema/replySchema.js";


const { Client, LocalAuth, MessageMedia } = pkg;
let qrCode;
const users = {};
const userMap = {};
function createClient(req, res) {
  const { id } = req.body;
  users[id] = new Client({
    authStrategy: new LocalAuth({ clientId: id }),
  });

  users[id].on("qr", (qr) => {
    qrCode = qr;
    qrcode.generate(qr, { small: true });
    res.json({ msg: "Client Created" });
  });

  users[id].on("ready", () => {
    console.log(`${id}'s Whatsapp Paired!`);
  });

  users[id].on("message", (message) => {
    const clientID = message.from;
    if (!userMap[clientID]) {
      userMap[clientID] = true;
      users[id].sendMessage(
        clientID,
        "Hello! This is your first message. How can I assist you?"
      );
      return;
    }

    handleMessage(message, users[id], id);
  });

  users[id].on("disconnected", () => {
    console.log(`${id}'s Whatsapp disconnect!`);
  });

  users[id].initialize();
}

async function displayQR(req, res) {
  const qrImage = await QRCode.toBuffer(qrCode, { type: "png" });
  res.setHeader("Content-Type", "image/png");
  res.send(qrImage);
}

async function handleMessage(message, usersID, id) {
  const msg = await replyModel.findOne({ message: message.body, userId: id });
  const PDFRegex = /\.PDF$/i;
  const imageRegex =
    /\.(PNG|JPEG|JPG|GIF|TIFF|TIF|BMP|SVG|WEBP|ICO|RAW|PSD|EPS|AI)$/i;
  const VideoRegex = /\.(MP4|AVI|MKV|WMV|MOV|FLV|MPEG|WEBM|OGV|MPG)$/i;
  if (msg) {
    if (PDFRegex.test(msg.reply)) {
      const dataBuffer = fs.readFileSync(`./media/${msg.reply}`);
      const base64PDF = dataBuffer.toString("base64");
      const media = new MessageMedia("application/pdf", base64PDF);
      usersID.sendMessage(message.from, media);
    } else if (imageRegex.test(msg.reply)) {
      const dataBuffer = fs.readFileSync(`./media/${msg.reply}`);
      const base64Image = dataBuffer.toString("base64");
      const media = new MessageMedia(
        `image/${msg.reply.slice(msg.reply.lastIndexOf("."))}`,
        base64Image
      );
      usersID.sendMessage(message.from, media);
    } else if (VideoRegex.test(msg.reply)) {
      const dataBuffer = fs.readFileSync(`./media/${msg.reply}`);
      const base64video = dataBuffer.toString("base64");
      const media = new MessageMedia(
        `video/${msg.reply.slice(msg.reply.lastIndexOf("."))}`,
        base64video
      );
      usersID.sendMessage(message.from, media);
    } else {
      message.reply(msg.reply);
    }
  } else {
    usersID.sendMessage(message.from, "please, choose option form list");
  }
}

export { createClient, displayQR };
