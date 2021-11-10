const express = require("express");
const path = require("path");

const API = require("call-of-duty-api")({ platform: "acti" });
const ServerFuncs = require("./getFullStats.js");
const ServerFuncs2 = require("./getWeeklyStats.js");

const PORT = 3000;
const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.json());

io.on("connection", (socket) => {
  socket.emit("welcome", "You are now connected with socket.io!");
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
