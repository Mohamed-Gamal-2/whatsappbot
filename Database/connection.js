import mongoose from "mongoose";
import { restoreSessions } from "../Module/ClientModule/client.controller.js";

export default function connect() {
  mongoose
    .connect(
      "mongodb+srv://whatsAppBot:whatsAppBot@cluster0.cxwngfz.mongodb.net/whatsAppBot"
    )
    .then(() => {
      console.log("Database Connected");
      restoreSessions();
    })
    .catch((err) => console.log(err));
}
