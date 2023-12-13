import QRCode from "qrcode";
import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
import { reply } from "../replyModule/reply.controller.js";

const { Client } = pkg;
let qrCode;
let client;

function createClient() {
  client = new Client({
    puppeteer: {
      executablePath:
        "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    },
  });
  console.log("client.info", client.info);
  client.on("qr", (qr) => {
    if (client.info) return;
    qrCode = qr;
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    console.log("Whatsapp Paired!");
    reply();
  });

  client.on("disconnected", () => {
    console.log("Whatsapp disconnect!");

    createClient();
  });

  client.initialize();
}

async function displayQR(req, res) {
  const qrImage = await QRCode.toBuffer(qrCode, { type: "png" });
  res.setHeader("Content-Type", "image/png");
  res.send(qrImage);
}

export { createClient, client, displayQR };
