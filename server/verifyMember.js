const credents = require("../hidden/UPW.js");
const API = require("call-of-duty-api");
const SSOtoken =
  "NjgyNzg2MDk4MzAyNDcwODAxODoxNjcyOTkyMDk0MDYzOmZiZWJkZmE4ZmIwNDgwNDNhYzEyZTljYWMxMTMxYzM1";

const getPlayerInfo = async (gamertag, platform) => {
  try {
    let loginMessage = await API.login(SSOtoken);
    console.log("loginMessage: ", loginMessage);
    return getData(gamertag, platform);
  } catch (Error) {
    console.log("getPlayerInfoError: ", Error);
  }
};

const getData = async (gamertag, platform) => {
  try {
    let data = await API.Warzone.fullData(gamertag, platform);
    return data;
  } catch (err) {
    console.log("getDataError: ", gamertag, err);
  }
};

const verifyMember = async (gamerTag, platform) => {
  console.log("gamerTag & platform: ", gamerTag, platform);
  const result = await getPlayerInfo(gamerTag, platform);
  if (result) {
    return result;
  } else {
    return false;
  }
};

module.exports = {
  verifyMember: verifyMember,
};
