const dbClient = require("../dbAccess");

const getWarzoneStats = (req, res) => {
  const db = dbClient.db("warzone");
  let stats;
  const dbGameStats = db.collection("gameStats");
  dbGameStats
    .find()
    .sort({ _id: -1 })
    .limit(1)
    .toArray(function (err, result) {
      if (err) {
        res.send("Error detected: " + err);
      } else {
        stats = {
          weeklyStats: result[0].weeklyStats,
          lifetimeStats: result[0].lifetimeStats,
        };
        res.status(200).json(stats);
      }
    });
};

module.exports = getWarzoneStats;
