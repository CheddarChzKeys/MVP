const credents = require("../hidden/UPW.js");
const API = require("call-of-duty-api")({ platform: "acti" });
const SSOtoken =
  "NjgyNzg2MDk4MzAyNDcwODAxODoxNjM2Njc0NjkyNTk0OmE0OTlhMWI1ZTUwMDliZTE5NjBmMWFiMjU3OWM2NWQ5";

const getPlayerInfo = async (gamertag, platform) => {
  try {
    let loginMessage = await API.loginWithSSO(SSOtoken);
    return getData(gamertag, platform);
  } catch (Error) {
    console.log(Error);
  }
};

const getData = async (gamertag, platform) => {
  try {
    let data = await API.MWBattleData(gamertag, platform);
    return data;
  } catch (err) {
    console.log(gamertag, err);
  }
};

const verifyMember = async (gamerTag, platform) => {
  console.log("gamerTag & platform: ", gamerTag, platform);
  const result = await getPlayerInfo(gamerTag, platform);
  if (result) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  verifyMember: verifyMember,
};
