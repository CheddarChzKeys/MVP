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

const bcrypt = require("bcrypt");

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.json());

mongo.connect("mongodb://127.0.0.1/warzone", function (err, client) {
  if (err) {
    throw err;
  }
  console.log("MongoDB connected...");
  const db = client.db("warzone");

  io.on("connection", (socket) => {
    socket.emit("welcome", "You are now connected with socket.io!");
    const chat = db.collection("chats");

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

    socket.on("sendMessage", (message) => {
      date = new Date().toLocaleString();
      chat.insertOne({
        name: message[0],
        message: message[1],
        date: date,
      });
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

  app.post("/signup", async (req, res) => {
    const users = db.collection("users");
    const username = req.body.username;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    await users.insertOne({ username, password: hashedPassword });
    users.find().toArray(function (err, data) {
      if (err) {
        throw err;
      }
      res.send(data);
    });
  });

  app.post("/login", async (req, res) => {
    const usernameAttempt = req.body.username;
    const passwordAttempt = req.body.password;
    const users = db.collection("users");
    const foundUser = await users.findOne({ username: usernameAttempt });
    if (!foundUser) {
      res.status(200).json({ message: "Invalid username" });
    } else {
      console.log(foundUser);
      bcrypt.compare(
        passwordAttempt,
        foundUser.password,
        function (err, result) {
          if (result == false) {
            res.json({ message: "Invalid password" });
          } else {
            res.json({
              message: `Welcome Soldier`,
              user: foundUser,
            });
          }
        }
      );
    }
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
