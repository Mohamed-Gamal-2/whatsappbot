import express from "express";
import { displayQR } from "./client.controller.js";

const clientRouter = express.Router();

clientRouter.get("/", displayQR);

export { clientRouter };
