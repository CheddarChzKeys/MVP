const getStatsDb = require("../../models/stats/getStatsDb");

const getWarzoneStats = async (req, res) => {
  try {
    const statsDb = await getStatsDb();
    const stats = {
      weeklyStats: statsDb[0].weeklyStats,
      lifetimeStats: statsDb[0].lifetimeStats,
    };
    res.send(stats);
  } catch (err) {
    console.log(`Error detected: ${err}`);
    res.send({ weeklyStats: [], lifetimeStats: [] });
  }
};

module.exports = getWarzoneStats;
