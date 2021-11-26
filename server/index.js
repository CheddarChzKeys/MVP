const express = require("express");
const path = require("path");

const API = require("call-of-duty-api")({ platform: "acti" });
const getStats = require("./getStats.js");
const verifyMember = require("./verifyMember.js");

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
          socket.emit("output", res);
        });
    });
  });

  app.post("/verify", async (req, res) => {
    const gamerTag = req.body.gamerTag;
    const platform = req.body.platform;

    const result = await verifyMember.verifyMember(gamerTag, platform);
    res.send(result);
  });

  app.post("/signUp", async (req, res) => {
    const users = db.collection("users");
    const username = req.body.username;
    const password = req.body.password;
    const gamerTag = req.body.gamerTag;
    const platform = req.body.platform;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.findOne({ username: username }, async (err, data) => {
      if (data) {
        res.send("Username already taken");
      } else {
        await users.insertOne({
          username,
          password: hashedPassword,
          gamerTag,
          platform,
        });
        res.send("New soldier enlisted");
      }
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

  app.get("/getWeekStats", (req, res) => {
    // res.set('Access-Control-Allow-Origin', '*')
    let stats = {};
    const dbGameStats = db.collection("gameStats");
    dbGameStats
      .find()
      .sort({ _id: -1 })
      .limit(1)
      .toArray(function (err, result) {
        if (err) {
          res.send("Error detected: " + err);
        } else {
          stats = result[0];
          res.status(200).json(stats);
        }
      });
  });

  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"), function (err) {
      if (err) {
        res.status(500).send(err);
      }
    });
  });

  //fetch real time stats from COD API every 5 minutes and save to database.
  // getStats(db);
  const updateWeeklyStats = setInterval(() => getStats.getStats(db), 300000);
});

server.listen(PORT, () => {
  console.log(`Server listening at localhost: ${PORT}`);
});
