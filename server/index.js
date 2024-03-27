const express = require("express");
const path = require("path");

const updateStatsDb = require("./models/updateStatsDb.js");
const updateNewsDb = require("./models/updateNewsDb.js");

const app = express();
const PORT = 8080;
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const dbClient = require("./dbAccess");

// import API from "call-of-duty-api";
// API.login(ssoToken: string);

const usersRoutes = require("./routes/usersRoutes");
const newsRoutes = require("./routes/newsRoutes");
const statsRoutes = require("./routes/statsRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const chatRoutes = require("./routes/chatRoutes");

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
const db = dbClient.db("warzone");
updateStatsDb();
updateNewsDb();
chatRoutes(io);

app.use("/users", usersRoutes);
app.use("/news", newsRoutes);
app.use("/stats", statsRoutes);
app.use("/gallery", galleryRoutes);

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
