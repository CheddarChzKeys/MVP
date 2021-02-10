const API = require("call-of-duty-api")({ platform: "acti" });
const credents = require("./hidden/UPW.js");
const express = require("express");
const path = require("path");
const ServerFuncs = require("./Server/getFullStats.js");

const PORT = 3000;
const app = express();

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.json());

app.get("/getStats", (req, res) => {
  // res.set('Access-Control-Allow-Origin', '*')
  ServerFuncs.getFullStats()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.send("Error detected: " + error);
    });
});

app.listen(PORT, () => {
  console.log(`Server listening at localhost:${3000}!`);
});
