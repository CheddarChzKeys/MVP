const dbClient = require("../../dbAccess");
const db = dbClient.db("warzone");
const users = db.collection("users");

const createUser = (newUserObject) =>  users.insertOne(newUserObject);

module.exports = createUser;