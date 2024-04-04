const dbClient = require("../../dbAccess");

const db = dbClient.db("warzone");
const usersDb = db.collection("users");

const findUsers = (username) => {
  if (username) {
    return usersDb.findOne({ usernameLowerCase: username.toLowerCase() });
  } else {
    return usersDb.find({}).toArray();
  }
};

module.exports = findUsers;
