const verifyGamerTag = require("../../models/users/verifyGamerTag");

const verify = async (req, res) => {
  try {
    const gamerTag = req.body.gamerTag;
    const platform = req.body.platform;

    const result = await verifyGamerTag(gamerTag, platform);
    res.send(result);
  } catch (err) {
    res.send("error");
  }
};

module.exports = verify;
