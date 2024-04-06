const apiLogInController = require("../callOfDutyApi/apiLogInController");
const API = require("call-of-duty-api");

const verify = async (req, res) => {
  try {
    const gamerTag = req.body.gamerTag;
    const platform = req.body.platform;
    const logInResult = await apiLogInController(gamerTag, platform);
    const data = await API.Warzone.fullData(gamerTag, platform);
    res.send(data.status);
  } catch (err) {
    console.log(`Error: ${err}`);
    res.send(err);
  }
};

module.exports = verify;
