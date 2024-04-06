const credents = require("../../../hidden/UPW.js");
const API = require("call-of-duty-api");
const ssoToken = require("../../../hidden/ssoToken");

const apiLogIn = () => API.login(ssoToken.token);

const getData = (gamertag, platform) =>
  API.Warzone.fullData(gamertag, platform);

const verifyGamerTag = async (gamerTag, platform) => {
  try {
    const logInResult = await apiLogIn();
    const data = await getData(gamerTag, platform);
    return data.status;
  } catch (err) {
    console.log(`Error: ${err}`);
    return err;
  }
};

module.exports = verifyGamerTag;
