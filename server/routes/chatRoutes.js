const dbClient = require("../dbAccess");
const { ObjectId } = require("mongodb");

const getChatsController = require("../controllers/chats/getChatsController");
const getMoreChatsController = require("../controllers/chats/getMoreChatsController");
const addNewChatController = require("../controllers/chats/addNewChatController");
const sendGifController = require("../controllers/chats/addNewGifController");

const socketRoutes = (io) => {
  io.on("connection", (socket) => {
    socket.emit("welcome", "You are now connected with socket.io!");
    const db = dbClient.db("warzone");
    const chat = db.collection("chats");

    getChatsController(socket);
    getMoreChatsController(socket);
    addNewChatController(socket);
    sendGifController(socket);
  });
};

module.exports = socketRoutes;
