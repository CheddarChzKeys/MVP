const express = require("express");
const path = require("path");

const updateStats = require("./models/updateStats");
const getNews = require("./getNews.js");

const app = express();
const PORT = 8080;

const server = require("http").createServer(app);
const io = require("socket.io")(server);
const mongo = require("mongodb").MongoClient;
const mongoClient = require("./dbaccess");
const { ObjectId } = require("mongodb");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// import API from "call-of-duty-api";
// API.login(ssoToken: string);

const usersRoutes = require("./routes/usersRoutes");
const newsRoutes = require(".routes/newsRoutes");

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.json());

// Use below line when deploying via Docker
// mongo.connect("mongodb://mongo:27017/warzone", function (err, client) {
// let db;
// mongo.connect("mongodb://localhost/warzone", function (err, client) {
//   if (err) {
//     throw err;
//   }
//   console.log("MongoDB connected...");
const db = mongoClient.db("warzone");
updateStats(db);
// })

io.on("connection", (socket) => {
  socket.emit("welcome", "You are now connected with socket.io!");
  const chat = db.collection("chats");

  sendStatus = function (s) {
    socket.emit("status", s);
  };

  socket.on("getAllChats", async () => {
    const collectionCount = await chat.count();
    chat
      .find()
      .limit(10)
      .sort({ _id: -1 })
      .toArray(function (err, res) {
        if (err) {
          ``;
          throw err;
        }
        const resultObject = {
          result: res,
          loadedAll: false,
        };
        if (res.length == collectionCount) {
          resultObject.loadedAll = true;
        }
        socket.emit("allChats", resultObject);
      });
  });

  socket.on("getMoreChats", (firstID) => {
    console.log("first chat id:", firstID);
    let collectionCount = 0;
    const galleryDB = db.collection("gallery");
    chat.find({ _id: { $lt: ObjectId(firstID) } }).count((err, result) => {
      if (err) {
        throw err;
      } else {
        collectionCount = result;
      }
    });
    chat
      .find({ _id: { $lt: ObjectId(firstID) } })
      .sort({ _id: -1 })
      .limit(10)
      .toArray((err, result) => {
        if (err) {
          throw err;
        } else {
          const resultObject = {
            result: result,
            loadedAll: false,
            collectionCount: collectionCount,
          };
          if (result.length === collectionCount) {
            resultObject.loadedAll = true;
          }
          socket.emit("addOlderChats", resultObject);
        }
      });
  });

  socket.on("sendMessage", (message) => {
    const date = new Date();
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

  socket.on("sendGif", (gifMessage) => {
    console.log("heard sendGif");
    const date = new Date();
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
});

app.use("/users", usersRoutes);

// app.post("/login", async (req, res) => {
//   const usernameAttempt = req.body.username.toLowerCase();
//   const passwordAttempt = req.body.password;
//   const users = db.collection("users");
//   const refreshTokens = db.collection("refreshTokens");
//   const foundUser = await users.findOne({
//     usernameLowerCase: usernameAttempt,
//   });
//   if (!foundUser) {
//     res.status(200).json({ message: "Invalid username" });
//   } else {
//     bcrypt.compare(passwordAttempt, foundUser.password, function (err, result) {
//       if (result == false) {
//         res.json({ message: "Invalid password" });
//       } else {
//         //create jwt and send to client
//         const accessToken = jwt.sign({ user: foundUser }, "secret", {
//           expiresIn: "30s",
//         });
//         const refreshToken = jwt.sign(
//           {
//             user: foundUser,
//           },
//           "secret",
//           { expiresIn: "1h" }
//         );
//         refreshTokens.insertOne({
//           refreshToken,
//         });
//         console.log("FOUND USER: ", foundUser);
//         res.json({
//           user: foundUser,
//           accessToken: accessToken,
//           refreshToken: refreshToken,
//         });
//       }
//     });
//   }
// });

// app.post("/logout", async (req, res) => {
//   const deadRefreshToken = req.body.deadRefreshToken;
//   const refreshTokens = db.collection("refreshTokens");
//   await refreshTokens.deleteOne({
//     refreshToken: deadRefreshToken,
//   });
// });

// app.post("/verifyToken", (req, res) => {
//   const accessToken = req.body.accessToken;
//   console.log("VERIFYING TOKENS");
//   jwt.verify(accessToken, "secret", async (err, decoded) => {
//     if (err) {
//       const refreshToken = req.body.refreshToken;
//       if (refreshToken) {
//         console.log("FOUND LOCAL REFRESH TOKEN");
//         const refreshTokens = db.collection("refreshTokens");
//         const foundRefreshToken = await refreshTokens.findOne({
//           refreshToken: refreshToken,
//         });
//         if (foundRefreshToken) {
//           console.log("FOUND DB REFRESH TOKEN");
//           jwt.verify(
//             foundRefreshToken.refreshToken,
//             "secret",
//             async (err, decoded) => {
//               if (err) {
//                 await refreshTokens.deleteOne({
//                   refreshToken: foundRefreshToken.refreshToken,
//                 });
//                 return res.status(401).send(err);
//               } else {
//                 console.log("REFRESH DECODED: ", decoded);
//                 const newAccessToken = jwt.sign(decoded.user, "secret", {
//                   expiresIn: "30s",
//                 });
//                 return res
//                   .status(200)
//                   .json({ user: decoded, newAccessToken: newAccessToken });
//               }
//             }
//           );
//         }
//       } else {
//         return res.status(401).send(err);
//       }
//     } else {
//       console.log("DECODED: ", decoded);
//       return res.status(200).json({ user: decoded });
//     }
//   });
// });

// app.get("/getMemberList", (req, res) => {
//   let members = [];
//   const users = db.collection("users");
//   users.find({}).toArray((err, result) => {
//     if (err) {
//       console.log("db.users error: ", err);
//     } else {
//       console.log("Here's a members log:", result);
//       return res.status(200).json(result);
//     }
//   });
// });

// app.post("/newGalleryContent", (req, res) => {
//   const newContentItem = req.body;
//   const dbGallery = db.collection("gallery");
//   dbGallery.insertOne(newContentItem).then((response, err) => {
//     if (err) {
//       res.send({ message: "Error uploading to gallery:" }, err);
//     } else {
//       res.send({ message: "Successfully uploaded to gallery" });
//     }
//   });
// });

app.get("/getDbStats", (req, res) => {
  let stats;
  const dbGameStats = db.collection("gameStats");
  dbGameStats
    .find()
    .sort({ _id: -1 })
    .limit(1)
    .toArray(function (err, result) {
      if (err) {
        res.send("Error detected: " + err);
      } else {
        stats = {
          weeklyStats: result[0].weeklyStats,
          lifetimeStats: result[0].lifetimeStats,
        };
        res.status(200).json(stats);
      }
    });
});

app.use("/news", newsRoutes);

app.get("/updateNews", async (req, res) => {
  resultMessage = await getNews.getNews(db);
  console.log(resultMessage);
  res.send(resultMessage);
});

// app.get("/getNews", (req, res) => {
//   const newsDB = db.collection("news");
//   const collectionCount = newsDB.count();
//   newsDB
//     .find()
//     .sort({ publishedAt: -1 })
//     .limit(10)
//     .toArray((err, result) => {
//       if (err) {
//         res.send("Error detected: " + err);
//       } else {
//         const resultObject = {
//           result: result,
//           loadedAll: false,
//         };
//         if (result.length === collectionCount) {
//           resultObject.loadedAll = true;
//         }
//         res.send(resultObject);
//       }
//     });
// });

app.get("/getOlderArticles", (req, res) => {
  const lastArticleDate = req.query.last
    ? req.query.last
    : "2022-03-00T00:00:01Z";
  let collectionCount;
  const newsDB = db.collection("news");
  newsDB
    .find({ publishedAt: { $lt: lastArticleDate } })
    .count((err, result) => {
      if (err) {
        res.send("Database Error Detected:", err);
      } else {
        collectionCount = result;
      }
    });
  newsDB
    .find({ publishedAt: { $lt: lastArticleDate } })
    .sort({ publishedAt: -1 })
    .limit(10)
    .toArray((err, result) => {
      if (err) {
        res.send("Database Error Detected:", err);
      } else {
        const resultObject = {
          result: result,
          loadedAll: false,
        };
        if (result.length === collectionCount) {
          resultObject.loadedAll = true;
        }
        res.send(resultObject);
      }
    });
});

app.get("/getGalleryContent", (req, res) => {
  const galleryDB = db.collection("gallery");
  let collectionCount;
  galleryDB.count((err, result) => {
    if (err) {
      res.send("Database Error Detected: ", err);
    } else {
      collectionCount = result;
    }
  });
  galleryDB
    .find()
    .sort({ _id: -1 })
    .limit(12)
    .toArray((err, result) => {
      if (err) {
        res.send("Database Error Detected:", err);
      } else {
        const resultObject = {
          result: result,
          loadedAll: false,
        };
        console.log("collectionCount: ", collectionCount);
        console.log("result.length: ", result.length);
        if (result.length == collectionCount) {
          console.log("condition should be true");
          resultObject.loadedAll = true;
        }
        console.log("resultObject.loadedAll: ", resultObject.loadedAll);
        res.send(resultObject);
      }
    });
});

app.get("/getPrevGalleryContent", (req, res) => {
  const firstID = req.query.first
    ? req.query.first
    : "999999999999999999999999";
  let collectionCount;
  const galleryDB = db.collection("gallery");
  galleryDB.find({ _id: { $gt: ObjectId(firstID) } }).count((err, result) => {
    if (err) {
      res.send("Database Error Detected:", err);
    } else {
      collectionCount = result;
    }
  });
  galleryDB
    .find({ _id: { $gt: ObjectId(firstID) } })
    .sort({ _id: 1 })
    .limit(12)
    .toArray((err, result) => {
      if (err) {
        res.send("Database Error Detected:", err);
      } else {
        const resultObject = {
          result: result,
          loadedAll: false,
          collectionCount: collectionCount,
        };
        if (result.length === collectionCount) {
          resultObject.loadedAll = true;
        }
        res.send(resultObject);
      }
    });
});

app.get("/getNextGalleryContent", (req, res) => {
  const lastID = req.query.last ? req.query.last : "999999999999999999999999";
  let collectionCount;
  const galleryDB = db.collection("gallery");
  galleryDB.find({ _id: { $lt: ObjectId(lastID) } }).count((err, result) => {
    if (err) {
      res.send("Database Error Detected:", err);
    } else {
      collectionCount = result;
    }
  });
  galleryDB
    .find({ _id: { $lt: ObjectId(lastID) } })
    .sort({ _id: -1 })
    .limit(12)
    .toArray((err, result) => {
      if (err) {
        res.send("Database Error Detected:", err);
      } else {
        const resultObject = {
          result: result,
          loadedAll: false,
          collectionCount: collectionCount,
        };
        console.log("RESULT.LENGTH: ", result.length);
        console.log("COLLECTIONCOUNT: ", collectionCount);
        if (result.length === collectionCount) {
          resultObject.loadedAll = true;
        }
        res.send(resultObject);
      }
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

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

//fetch real time stats from COD API every 5 minutes and save to database.
// getStats(db);
// const updateDbStats = setInterval(() => getApiStats.getApiStats(db), 150000);

server.listen(PORT, () => {
  console.log(`Server listening at localhost: ${PORT}`);
});
