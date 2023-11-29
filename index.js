import express from "express";
import connect from "./Database/connection.js";
import cors from "cors";

const server = express();

server.use(express.json());
server.use(cors());
connect();

server.listen(8000, () => {
  console.log("Server Started");
});
