import express from "express";
import {
  createClient,
  displayQR,
  getGroupNumbers,
  getNumbers,
} from "./client.controller.js";

const clientRouter = express.Router();

clientRouter.get("/", displayQR);
clientRouter.post("/newClient", createClient);
clientRouter.get("/getNumbers", getNumbers);
clientRouter.get("/groupNumbers", getGroupNumbers);

export { clientRouter };
