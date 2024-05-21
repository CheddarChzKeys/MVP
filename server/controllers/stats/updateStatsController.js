const dbClient = require("../../dbAccess");
const db = dbClient.db("warzone");
const findUsersDb = require("../../models/users/findUsersDb");
const updateStatsDb = require("../../models/stats/updateStatsDb");
const API = require("call-of-duty-api");
const apiLogInController = require("../callOfDutyApi/apiLoginController");

const updateStats = async () => {
  const apiLogIn = apiLogInController();
  const users = await findUsersDb();

  const allUsersStats = await Promise.all(
    users.map(async (user) => {
      return await API.Warzone.fullData(user.gamerTag, user.platform);
    })
  );

  updateStatsDb(allUsersStats);

  



  console.log("ALL USERS STATS:", allUsersStats);
  // console.log("data.lifetime:", lifetimeStats[0].data.lifetime);
  // console.log("data.lifetime.all:", lifetimeStats[0].data.lifetime.all);
  // console.log("data.lifetime.accoladeData.properties:", lifetimeStats[0].data.lifetime.accoladeData.properties);
  // console.log("data.lifetime.mode.br_all:", lifetimeStats[0].data.lifetime.mode.br_all);

};

module.exports = updateStats;
