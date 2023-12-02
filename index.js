import express from "express";
import connect from "./Database/connection.js";
import cors from "cors";
import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
import fs from "fs";
import { reply } from "./Module/ClientModule/client.controller.js";
import { clientRouter } from "./Module/ClientModule/client.router.js";

const { Client, LegacySessionAuth } = pkg;
const SESSION_FILE_PATH = "./session.json";
const server = express();

server.use(express.json());
server.use(cors());
server.use(clientRouter);
connect();

// whatsapp package
let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

let qrCode;
let client;

function createClient() {
  client = new Client();
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
createClient();

server.listen(process.env.PORT || 8000, () => {
  console.log("Server Started");
});

export { client, qrCode };
