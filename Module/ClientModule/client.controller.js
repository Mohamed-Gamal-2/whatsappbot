import { client } from "../../index.js";

// Use an object to store information about users
const userMap = {};

function reply() {
  client.on("message", (message) => {
    console.log(message);

    // Extracting sender's ID
    const clientID = message.from;
    console.log("usermap", userMap[clientID]);
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

function handleMessage(message) {
  // Handle different message cases
  if (message.body.toLowerCase() === "!ping") {
    // Respond to !ping with "pong"
    message.reply("pong");
  } else if (message.body.toLowerCase() === "hi") {
    // Respond to "Hi" with a greeting
    client.sendMessage(message.from, "Hello there! How can I help you?");
  }
  // Add more message handling cases if needed
}

export { reply };
