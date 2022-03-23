const credents = require("../hidden/UPW.js");
const API = require("call-of-duty-api")({ platform: "acti" });
const SSOtoken =
  "NjgyNzg2MDk4MzAyNDcwODAxODoxNjM2Njc0NjkyNTk0OmE0OTlhMWI1ZTUwMDliZTE5NjBmMWFiMjU3OWM2NWQ5";

const getPlayerInfo = async (gamertag, platform, whichStats) => {
  try {
    let loginMessage = await API.loginWithSSO(SSOtoken);
    return getData(gamertag, platform, whichStats);
  } catch (Error) {
    // console.log(Error);
  }
};

const getData = async (gamertag, platform, whichStats) => {
  try {
    if (whichStats == "weekly") {
      let data = await API.MWweeklystats(gamertag, platform);
      return data;
    } else {
      let data = await API.MWBattleData(gamertag, platform);
      return data;
    }
  } catch (Error) {
    console.log(gamertag, Error);
  }
};

const members = [
  { username: "JRICKROSS", platform: "psn" },
  { username: "mRey89", platform: "psn" },
  { username: "JUSSDRAMA", platform: "psn" },
  { username: "JERONIMO_K", platform: "psn" },
  { username: "KiDKEN90", platform: "psn" },
  { username: "nohypejustBEAST#4116916", platform: "acti" },
  { username: "TRYK187", platform: "xbl" },
  { username: "fguritout2mrw", platform: "xbl" },
  { username: "booty_Thumper#5605139", platform: "acti" },
  { username: "jjuice89", platform: "psn" },
  // { username: "ﾌoeﾚ#2860330", platform: "acti" },
];

const getApiStats = (db) => {
  const allMembersWeeklyStats = [];
  const allMembersLifetimeStats = [];

  return Promise.all(
    members.map((member) => {
      return getPlayerInfo(member.username, member.platform, "weekly").then(
        (data) => {
          if (data.wz.all.properties) {
            data.wz.all.properties.username = member.username.split("#")[0];
            data.wz.all.properties.kdRatio = parseFloat(
              data.wz.all.properties.kdRatio.toFixed(2)
            );
            data.wz.all.properties.avgLifeTime = parseFloat(
              data.wz.all.properties.avgLifeTime.toFixed(2)
            );
            data.wz.all.properties.headshotPercentage = parseFloat(
              data.wz.all.properties.headshotPercentage.toFixed(2)
            );
            data.wz.all.properties.killsPerGame = parseFloat(
              data.wz.all.properties.killsPerGame.toFixed(2)
            );
            data.wz.all.properties.distanceTraveled = Math.floor(
              // feet to miles conversion
              data.wz.all.properties.distanceTraveled / 5280
            );
            data.wz.all.properties.avgLifeTime = Math.floor(
              data.wz.all.properties.avgLifeTime
            );
            allMembersWeeklyStats.push(data.wz.all.properties);
          }
        }
      );
    })
  )
    .then(() => {
      return Promise.all(
        members.map((member) => {
          return getPlayerInfo(
            member.username,
            member.platform,
            "lifetime"
          ).then((data) => {
            data.br.username = member.username.split("#")[0];
            allMembersLifetimeStats.push(data.br);
          });
        })
      );
    })

    .then(() => {
      const statsDB = db.collection("gameStats");
      statsDB.findOneAndReplace(
        {},
        {
          weeklyStats: allMembersWeeklyStats,
          lifetimeStats: allMembersLifetimeStats,
          date: new Date(),
        },
        {
          upsert: true,
        }
      );
    })
    .then(() => {
      console.log("All stats updated");
    });
};

module.exports = {
  getApiStats: getApiStats,
};
