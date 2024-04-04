const addChatDb = require("../../models/chats/addChatDb");
const getChatsCountDb = require("../../models/chats/getChatsCountDb");
const getChatsDb = require("../../models/chats/getChatsDb");

const addChat = (socket) => {
  socket.on("sendMessage", async (message) => {
    const date = new Date();
    const newChat = {
      name: message.username,
      message: message.typedMessage,
      image: message.imageURLs,
      video: message.submittedVideo,
      date: date,
      png: message.png,
    };
    const newChatResult = await addChatDb(newChat);
    const count = await getChatsCountDb();
    const result = await getChatsDb();
    const loadedAll = result.length === count ? true : false;
    socket.emit("allChats", { result, loadedAll });
  });
};

module.exports = addChat;
