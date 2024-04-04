const dbClient = require("../../dbAccess");
const db = dbClient.db("warzone");
const chats = db.collection("chats");
const { ObjectId } = require("mongodb");

const getChatsCount = (firstId) => {
  if (firstId) {
    return chats.find({ _id: { $lt: ObjectId(firstId) } }).count();
  } else {
    chats.countDocuments();
  }
};

module.exports = getChatsCount;
