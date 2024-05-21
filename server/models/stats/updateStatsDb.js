const dbClient = require("../../dbAccess");
const db = dbClient.db("warzone");


// const members = [
//   { username: "JRICKROSS", platform: "psn" },
//   { username: "mRey89", platform: "psn" },
//   { username: "JUSSDRAMA", platform: "psn" },
//   { username: "JERONIMO_K", platform: "psn" },
//   { username: "KiDKEN90", platform: "psn" },
//   { username: "nohypejustBEAST#4116916", platform: "acti" },
//   { username: "TRYK187", platform: "xbl" },
//   { username: "fguritout2mrw", platform: "xbl" },
//   { username: "booty_Thumper#5605139", platform: "acti" },
//   { username: "jjuice89", platform: "psn" },
//   // { username: "ﾌoeﾚ#2860330", platform: "acti" },
// ];

const updateStatsDb = async (allUsersStats) => {
  const statsDB = db.collection("gameStats");
  statsDB.findOneAndReplace(
    {},
    {
      allUsersStats,
      date: new Date(),
    },
    {
      upsert: true,
    }
  )
  .then(() => {
    console.log("All stats updated");
  });
}

module.exports = updateStatsDb;
