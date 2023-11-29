import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
import fs from "fs";
import mongoose from "mongoose";
const { Client, LegacySessionAuth } = pkg;
const SESSION_FILE_PATH = "./session.json";

export default function connect() {
  mongoose

    .connect(
      "mongodb+srv://whatsAppBot:whatsAppBot@cluster0.cxwngfz.mongodb.net/whatsAppBot"
    )
    .then(() => {
      console.log("Database Connected");

      let sessionData;
      if (fs.existsSync(SESSION_FILE_PATH)) {
        sessionData = require(SESSION_FILE_PATH);
      }
      const client = new Client();

      client.on("qr", (qr) => {
        qrcode.generate(qr, { small: true });
      });

      client.on("ready", () => {
        console.log("Client is ready!");
      });

      client.on("message", (message) => {
        if (message.body === "!ping") {
          message.reply("pong");
        }
      });

      client.initialize();
    })
    .catch((err) => console.log(err));
}
