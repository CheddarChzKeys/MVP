const dbClient = require("../../dbAccess");
const db = dbClient.db("warzone");

const usersDb = db.collection("users");

const findUser = (username) => usersDb.findOne({usernameLowerCase: username.toLowerCase()})

module.exports = findUser;

