const dbClient = require("../../dbAccess.js");

const getMembers = (req, res) => {
  let members = [];
  const db = dbClient.db("warzone");
  const users = db.collection("users");
  users.find({}).toArray((err, result) => {
    if (err) {
      console.log("db.users error: ", err);
    } else {
      console.log("Here's a members log:", result);
      return res.status(200).json(result);
    }
  });
};

module.exports = getMembers;
