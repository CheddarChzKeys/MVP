const dbClient = require("../../dbAccess");
const { ObjectId } = require("mongodb");

const getMoreChats = (socket) => {
  socket.on("getMoreChats", (firstID) => {
    console.log("first chat id:", firstID);
    let collectionCount = 0;
    const db = dbClient.db("warzone");
    const chat = db.collection("chats");
    chat.find({ _id: { $lt: ObjectId(firstID) } }).count((err, result) => {
      if (err) {
        throw err;
      } else {
        collectionCount = result;
      }
    });
    chat
      .find({ _id: { $lt: ObjectId(firstID) } })
      .sort({ _id: -1 })
      .limit(10)
      .toArray((err, result) => {
        if (err) {
          throw err;
        } else {
          const resultObject = {
            result: result,
            loadedAll: false,
            collectionCount: collectionCount,
          };
          if (result.length === collectionCount) {
            resultObject.loadedAll = true;
          }
          socket.emit("addOlderChats", resultObject);
        }
      });
  });
};

module.exports = getMoreChats;
