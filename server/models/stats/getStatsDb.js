const dbClient = require("../../dbAccess");
const db = dbClient.db("warzone");
const stats = db.collection("gameStats");

const getStats = () => {
  return stats
    .find()
    .sort({ _id: -1 })
    .limit(1)
    .toArray()
    .catch((err) => {
      console.log(`Error: ${err}`);
      return [];
    });
};

module.exports = getStats;
