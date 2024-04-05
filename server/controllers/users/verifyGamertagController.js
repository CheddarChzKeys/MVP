const verifyMember = require("../../models/verifyMember.js");

const verify = async (req, res) => {
  try {
    const gamerTag = req.body.gamerTag;
    const platform = req.body.platform;

    const result = await verifyMember.verifyMember(gamerTag, platform);
    res.send(result);
  } catch (err) {
    res.send(false);
  }
};

module.exports = verify;
