import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
    reply: {
        type: String,
        required:true
    },
    message:{
        type: String,
        required:true,
        unique:true
    }

});

const replyModel = mongoose.model("Reply", replySchema);

export default replyModel ;