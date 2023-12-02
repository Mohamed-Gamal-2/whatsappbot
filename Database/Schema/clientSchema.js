import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({});

const ClientModel = mongoose.model("Client", clientSchema);

export default { ClientModel };
