const dbClient = require("../../dbAccess");
const db = dbClient.db("warzone");
const usersDb = db.collection("users");
const findUsersDb = require("../../models/users/findUsersDb");
const API = require("call-of-duty-api");
const apiLogInController = require("../callOfDutyApi/apiLoginController");

const updateStats = async () => {
  const apiLogIn = apiLogInController();
  const users = await findUsersDb();

  const lifetimeStats = await Promise.all(
    users.map(async (user) => {
      return await API.Warzone.fullData(user.gamerTag, user.platform);
    })
  );
  console.log("LIFETIMESTATS:", lifetimeStats);
  console.log("Deeper:", lifetimeStats[0].data.lifetime.mode.br);
};

module.exports = updateStats;
