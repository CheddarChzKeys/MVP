const dbClient = require("../../dbAccess");

const addChat = (socket) => {
  socket.on("sendMessage", (message) => {
    const date = new Date();
    const db = dbClient.db("warzone");
    const chat = db.collection("chats");
    chat.insertOne({
      name: message.username,
      message: message.typedMessage,
      image: message.imageURLs,
      video: message.submittedVideo,
      date: date,
      png: message.png,
    });
    chat
      .find()
      .limit(10)
      .sort({ _id: -1 })
      .toArray(function (err, res) {
        if (err) {
          throw err;
        }
        const resultObject = {
          result: res,
          loadedAll: false,
        };
        console.log("output res:", resultObject);
        socket.emit("allChats", resultObject);
      });
  });
};

module.exports = addChat;
