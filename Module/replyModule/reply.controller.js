import replyModel from "../../Database/Schema/replySchema.js";
import { client } from "../ClientModule/client.controller.js";

const userMap = {};

function reply() {
  client.on("message", (message) => {
    // Extracting sender's ID
    const clientID = message.from;
    // Check if it's the first time the user is sending a message
    if (!userMap[clientID]) {
      // Set a flag to indicate that the user has sent a message
      userMap[clientID] = true;

      // Send the initial message for the first interaction
      client.sendMessage(
        clientID,
        "Hello! This is your first message. How can I assist you?"
      );
      return;
    }

    // Process other messages
    handleMessage(message);
  });
}

 async function handleMessage(message) {
    const msg = await replyModel.findOne({message: message.body})
    if (msg){
        message.reply(msg.reply)
    }else{
    client.sendMessage(message.from, "please, choose option form list");
       
    }
}

async function addReply(req,res){
    try{
        const reply = await replyModel.insertMany([req.body])
        res.json({ message: "reply added" , reply})
    }catch(error){
      if(error.errmsg?.includes("E11000 duplicate key")){
          res.json({
            message: "This message exists before , write unique message",
          });
      }else{
          res.json({ message: "error" , error})
        }
    }
}

async function updateReply(req,res){
    try{
        const {reply,message}=req.body
        if(!message){
            res.json({ message: " Enter your message" })
        }else{

            const updatedReply =await replyModel.findOneAndUpdate({message},{reply},{new:true})
            if (!updatedReply){
                res.json({ message: "message not found"});
            }
            res.json({ message: "7mo", updatedReply });
        }
        }catch(error){
            
            res.json({ message: "error" , error})
        }
        
    }
    
    async function getAllreplies(req,res){
        try{
            const allreplies = await replyModel.find()
            if (allreplies){
                res.json({message: "All replies" ,allreplies})
            }else{
                res.json({message: " No replies founded" })
            }
        }catch{
        res.json({ message: "error" , error})
    }
}
export { reply, addReply, updateReply, getAllreplies };