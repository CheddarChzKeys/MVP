const API = require("call-of-duty-api")({ platform: "acti" });
const credents = require("../hidden/UPW.js");

const getPlayerInfo = async (gamertag, platform) => {
  try {
    let loginMessage = await API.login(credents.username, credents.password);
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
    console.log(Error);
  }
};

const members = [
  { username: "JRICKROSS", platform: "psn" },
  { username: "mRey89", platform: "psn" },
  { username: "nohypeJUSTBEAST", platform: "psn" },
  { username: "Jeronimo#4017974", platform: "acti" },
  { username: "KiDKEN90", platform: "psn" },
  { username: "JUSSDRAMA", platform: "psn" },
  { username: "TRYK187", platform: "xbl" },
  { username: "fguritout2mrw", platform: "xbl" },
  { username: "booty_Thumper#5605139", platform: "acti" },
  { username: "jjuice89", platform: "psn" },
];

const getFullStats = () => {
  let FullStats = [];
  return Promise.all(
    members.map((member) => {
      return getPlayerInfo(member.username, member.platform).then((data) => {
        data.br.username = member.username;
        FullStats.push(data.br);
        return data;
      });
    })
  ).then(() => {
    return FullStats;
  });
};

module.exports = {
  getFullStats: getFullStats,
};
