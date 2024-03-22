const verifyMember = require("../verifyMember.js");

const verify = async (req, res) => {
    const gamerTag = req.body.gamerTag;
    const platform = req.body.platform;

    const result = await verifyMember.verifyMember(gamerTag, platform);
    res.send(result);
}

module.exports = {
    verify:verify,
}
