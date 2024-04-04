const getChatsCountDb = require("../../models/chats/getChatsCountDb");
const getChatsDb = require("../../models/chats/getChatsDb");

const getMoreChats = (socket) => {
  socket.on("getMoreChats", async (firstId) => {
    const count = await getChatsCountDb(firstId);
    const result = await getChatsDb(firstId);
    const loadedAll = result.length === count ? true : false;
    socket.emit("addOlderChats", {
      result,
      loadedAll,
      collectionCount: count,
    });
  });
};

module.exports = getMoreChats;
