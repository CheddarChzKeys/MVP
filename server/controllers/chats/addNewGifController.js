const dbClient = require("../../dbAccess");

const addGif = (socket) => {
  socket.on("sendGif", (gifMessage) => {
    console.log("heard sendGif");
    const date = new Date();
    const db = dbClient.db("warzone");
    const chat = db.collection("chats");
    chat.insertOne({
      name: gifMessage.username,
      gif: gifMessage.gif,
      date: date,
      png: gifMessage.png,
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

module.exports = addGif;
