const dbClient = require("../../dbAccess");
const db = dbClient.db("warzone");
const chats = db.collection("chats");

const addChat = (newChat) => chats.insertOne(newChat);

module.exports = addChat;
