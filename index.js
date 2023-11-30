import express from "express";
import connect from "./Database/connection.js";
import cors from "cors";
import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
import fs from "fs";
import { reply } from "./Module/ClientModule/client.controller.js";

const { Client, LegacySessionAuth } = pkg;
const SESSION_FILE_PATH = "./session.json";
const server = express();

server.use(express.json());
server.use(cors());
connect();

// whatsapp package
let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

let client;
if (!client) {
  client = new Client();
  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });
}

client.on("ready", () => {
  console.log("Whatsapp Paired!");
});

reply();

client.initialize();

server.listen(8000, () => {
  console.log("Server Started");
});

export { client };
