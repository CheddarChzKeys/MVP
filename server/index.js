const express = require("express");
const path = require("path");

const API = require("call-of-duty-api")({ platform: "acti" });
const ServerFuncs = require("./getFullStats.js");
const ServerFuncs2 = require("./getWeeklyStats.js");

const PORT = 3000;
const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server);
const mongo = require("mongodb").MongoClient;

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.json());

mongo.connect("mongodb://127.0.0.1/mongochat", function (err, client) {
  if (err) {
    throw err;
  }
  console.log("MongoDB connected...");
  io.on("connection", (socket) => {
    socket.emit("welcome", "You are now connected with socket.io!");
    let db = client.db("mongochat");
    let chat = db.collection("chats");

    chat.insertOne({ name: "Jerrick", message: "Yesssir" });

    sendStatus = function (s) {
      socket.emit("status", s);
    };

    chat
      .find()
      .limit(100)
      .sort({ _id: 1 })
      .toArray(function (err, res) {
        if (err) {
          throw err;
        }
        console.log(res);
        socket.emit("output", res);
      });
  });
});

app.get("/getStats", (req, res) => {
  // res.set('Access-Control-Allow-Origin', '*')
  let stats = {};
  ServerFuncs.lifetimeStats()
    .then((data) => {
      stats.lifetimeStats = data;
      res.status(200).json(stats.lifetimeStats);
    })
    .catch((error) => {
      res.send("Error detected: " + error);
    });
});

app.get("/getWeekStats", (req, res) => {
  // res.set('Access-Control-Allow-Origin', '*')
  let stats = {};
  ServerFuncs2.weeklyStats()
    .then((data) => {
      stats.weeklyStats = data;
      res.status(200).json(stats.weeklyStats);
    })
    .catch((error) => {
      res.send("Error detected: " + error);
    });
});

server.listen(PORT, () => {
  console.log(`Server listening at localhost: ${PORT}`);
});
