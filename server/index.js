const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");

const API = require("call-of-duty-api")({ platform: "acti" });
const getStats = require("./getStats.js");
const verifyMember = require("./verifyMember.js");
const getNews = require("./getNews.js");

const PORT = 8080;
const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server);
const mongo = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");

const bcrypt = require("bcrypt");

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.json());

// mongo.connect("mongodb://mongo:27017/warzone", function (err, client) {
mongo.connect("mongodb://localhost/warzone", function (err, client) {
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
      const date = new Date().toLocaleString();
      chat.insertOne({
        name: message[0],
        message: message[1],
        image: message[2],
        video: message[3],
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

    socket.on("sendGif", (gifMessage) => {
      console.log("heard sendGif");
      date = new Date().toLocaleString();
      chat.insertOne({
        name: gifMessage[0],
        gif: gifMessage[1],
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
    const usernameLowerCase = req.body.username.toLowerCase();
    const password = req.body.password;
    const gamerTag = req.body.gamerTag;
    const platform = req.body.platform;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.findOne(
      { usernameLowerCase: usernameLowerCase },
      async (err, data) => {
        if (data) {
          res.send("Username already taken");
        } else {
          await users.insertOne({
            username,
            usernameLowerCase,
            password: hashedPassword,
            gamerTag,
            platform,
          });
          res.send("New soldier enlisted");
        }
      }
    );
  });

  app.post("/login", async (req, res) => {
    const usernameAttempt = req.body.username.toLowerCase();
    const passwordAttempt = req.body.password;
    const users = db.collection("users");
    const refreshTokens = db.collection("refreshTokens");
    const foundUser = await users.findOne({
      usernameLowerCase: usernameAttempt,
    });
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
            //create jwt and send to client
            const accessToken = jwt.sign(
              {
                username: foundUser.username,
              },
              "secret",
              { expiresIn: "30s" }
            );
            const refreshToken = jwt.sign(
              {
                username: foundUser.username,
              },
              "secret",
              { expiresIn: "1h" }
            );
            refreshTokens.insertOne({
              refreshToken,
            });
            res.json({
              username: foundUser.username,
              accessToken: accessToken,
              refreshToken: refreshToken,
              message: "Welcome Soldier",
            });
          }
        }
      );
    }
  });

  app.post("/logout", async (req, res) => {
    const deadRefreshToken = req.body.deadRefreshToken;
    const refreshTokens = db.collection("refreshTokens");
    await refreshTokens.deleteOne({
      refreshToken: deadRefreshToken,
    });
  });

  app.post("/verifyToken", (req, res) => {
    const accessToken = req.body.accessToken;
    jwt.verify(accessToken, "secret", async (err, decoded) => {
      if (err) {
        const refreshToken = req.body.refreshToken;
        if (refreshToken) {
          const refreshTokens = db.collection("refreshTokens");
          const foundRefreshToken = await refreshTokens.findOne({
            refreshToken: refreshToken,
          });
          if (foundRefreshToken) {
            jwt.verify(
              foundRefreshToken.refreshToken,
              "secret",
              async (err, decoded) => {
                if (err) {
                  await refreshTokens.deleteOne({
                    refreshToken: foundRefreshToken.refreshToken,
                  });
                  return res.status(401).send(err);
                }
                const newAccessToken = jwt.sign(
                  {
                    username: decoded.username,
                  },
                  "secret",
                  { expiresIn: "30s" }
                );
                res
                  .status(200)
                  .json({ username: decoded.username, newAccessToken });
              }
            );
          }
        }
        return res.status(401).send(err);
      }
      res.status(200).json(decoded);
    });
  });

  app.post("/newGalleryContent", (req, res) => {
    const newContentItem = req.body;
    const dbGallery = db.collection("gallery");
    dbGallery.insertOne(newContentItem).then((response, err) => {
      if (err) {
        res.send({ message: "Error uploading to gallery:" }, err);
      } else {
        res.send({ message: "Successfully uploaded to gallery" });
      }
    });
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

  app.get("/getNews", (req, res) => {
    const newsDB = db.collection("news");
    newsDB
      .find()
      .sort({ publishedAt: -1 })
      .limit(5)
      .toArray((err, result) => {
        if (err) {
          res.send("Error detected: " + err);
        } else {
          res.send(result);
        }
      });
  });

  app.get("/getOlderArticles", (req, res) => {
    const lastArticleDate = req.query.last
      ? req.query.last
      : "2022-03-00T00:00:01Z";
    const newsDB = db.collection("news");
    newsDB
      .find({ publishedAt: { $lt: lastArticleDate } })
      .sort({ publishedAt: -1 })
      .limit(5)
      .toArray((err, result) => {
        if (err) {
          res.send("Database Error Detected:", err);
        } else {
          res.send(result);
        }
      });
  });

  app.get("/getGalleryContent", (req, res) => {
    const galleryDB = db.collection("gallery");
    galleryDB
      .find()
      .sort({ _id: -1 })
      .limit(16)
      .toArray((err, result) => {
        if (err) {
          res.send("Database Error Detected:", err);
        } else {
          res.send(result);
        }
      });
  });

  app.get("/getOlderGalleryContent", (req, res) => {
    const lastID = req.query.last ? req.query.last : "999999999999999999999999";
    const galleryDB = db.collection("gallery");
    galleryDB
      .find({ _id: { $lt: ObjectId(lastID) } })
      .sort({ _id: -1 })
      .limit(8)
      .toArray((err, result) => {
        if (err) {
          res.send("Database Error Detected:", err);
        } else {
          res.send(result);
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

  getNews.getNews(db);
});

server.listen(PORT, () => {
  console.log(`Server listening at localhost: ${PORT}`);
});
