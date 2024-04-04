const dbClient = require("../../dbAccess");
const db = dbClient.db("warzone");
const stats = db.collection("gameStats");

const getStats = () => {
  return stats
    .find()
    .sort({ _id: -1 })
    .limit(1)
    .toArray()
    .catch((error) => {
      console.log("IN THE DB CATCH ERROR");
      throw new Error("Stats database error");
    });
};

module.exports = getStats;
