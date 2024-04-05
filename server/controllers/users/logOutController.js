const refreshTokensDb = require("../../models/users/refreshTokensDb.js");
const dbClient = require("../../dbAccess.js");
db = dbClient.db("warzone");

const logOut = async (req, res) => {
  try {
    const deadRefreshToken = req.body.deadRefreshToken;
    const deleteResult = await refreshTokensDb.delete(deadRefreshToken);
    res.status(200);
  } catch (err) {
    console.log(`Error: ${err.message}`);
    res.send(err);
  }
};

module.exports = logOut;
