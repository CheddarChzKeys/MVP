const dbClient = require("../../dbAccess");

const getChats = (socket) => {
  socket.on("getAllChats", async () => {
    const db = dbClient.db("warzone");
    const chat = db.collection("chats");
    const collectionCount = await chat.count();
    chat
      .find()
      .limit(10)
      .sort({ _id: -1 })
      .toArray(function (err, res) {
        if (err) {
          ``;
          throw err;
        }
        const resultObject = {
          result: res,
          loadedAll: false,
        };
        if (res.length == collectionCount) {
          resultObject.loadedAll = true;
        }
        socket.emit("allChats", resultObject);
      });
  });
};

module.exports = getChats;
