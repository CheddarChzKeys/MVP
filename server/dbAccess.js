const MongoClient = require("mongodb").MongoClient;

const url = '"mongodb://localhost/warzone"';
const client = new MongoClient(url, { useUnifiedTopology: true });

client.connect(function (err) {
  console.log("Connected successfully to warzone database");
});

module.exports = client;
