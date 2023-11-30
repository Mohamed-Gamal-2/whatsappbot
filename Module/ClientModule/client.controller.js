import { client } from "../../index.js";
function reply() {
  client.on("message", (message) => {
    console.log(message);
    let clientID = message._data.id.remote;
    if (message.body === "!ping") message.reply("pong");
    else if (message.body === "Hi")
      client.sendMessage(clientID, "Hello there, How can I help you?");
  });
}

export { reply };
