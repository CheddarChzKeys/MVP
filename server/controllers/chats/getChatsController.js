const getChatsCountDb = require("../../models/chats/getChatsCountDb");
const getChatsDb = require("../../models/chats/getChatsDb");

const getChats = (socket) => {
  socket.on("getAllChats", async () => {
    try {
      const count = await getChatsCountDb();
      const result = await getChatsDb();
      const loadedAll = result.length === count ? true : false;
      socket.emit("allChats", { result, loadedAll });
    } catch (err) {
      console.log(`Error: ${err}`);
      socket.emit("allChats", { result: [], loadedAll: true });
    }
  });
};

module.exports = getChats;
