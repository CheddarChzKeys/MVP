const dbClient = require("../../dbAccess");
const db = dbClient.db("warzone");
const chats = db.collection("chats");
const { ObjectId } = require("mongodb");

const getChats = (firstId) => {
  const findObject = firstId ? { _id: { $lt: ObjectId(firstId) } } : {};
  return chats.find(findObject).sort({ _id: -1 }).limit(10).toArray();
};

module.exports = getChats;
