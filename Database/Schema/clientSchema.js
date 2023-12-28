import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  isLoggedIn: {
    type: Boolean,
    required: true,
  },
  participant: [{ type: String }],
});

const ClientModel = mongoose.model("Client", clientSchema);

export default ClientModel;
