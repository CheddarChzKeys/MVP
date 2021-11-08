const credents = require("../hidden/UPW.js");
const API = require("call-of-duty-api")({ platform: "acti" });
const SSOtoken =
  "NjgyNzg2MDk4MzAyNDcwODAxODoxNjM2Njc0NjkyNTk0OmE0OTlhMWI1ZTUwMDliZTE5NjBmMWFiMjU3OWM2NWQ5";

const getPlayerInfo = async (gamertag, platform) => {
  try {
    let loginMessage = await API.loginWithSSO(SSOtoken);
    console.log(loginMessage);
    return getData(gamertag, platform);
  } catch (Error) {
    console.log(Error);
  }
};

const getData = async (gamertag, platform) => {
  try {
    let data = await API.MWBattleData(gamertag, platform);
    return data;
  } catch (Error) {
    console.log(gamertag, Error);
  }
};

const members = [
  { username: "JRICKROSS", platform: "psn" },
  { username: "mRey89", platform: "psn" },
  { username: "JUSSDRAMA", platform: "psn" },
  // { username: "JERONIMO_K", platform: "psn" },
  { username: "KiDKEN90", platform: "psn" },
  { username: "nohypejustBEAST#4116916", platform: "acti" },
  { username: "TRYK187", platform: "xbl" },
  { username: "fguritout2mrw", platform: "xbl" },
  { username: "booty_Thumper#5605139", platform: "acti" },
  // { username: "jjuice89", platform: "psn" },
  { username: "ﾌoeﾚ#2860330", platform: "acti" },
];

const getAllMembersLifetimeStats = () => {
  let allMembersLifetimeStats = [];
  return Promise.all(
    members.map((member) => {
      return getPlayerInfo(member.username, member.platform).then((data) => {
        data.br.username = member.username.split("#")[0];
        allMembersLifetimeStats.push(data.br);
        return data;
      });
    })
  ).then(() => {
    return allMembersLifetimeStats;
  });
};

module.exports = {
  lifetimeStats: getAllMembersLifetimeStats,
};
