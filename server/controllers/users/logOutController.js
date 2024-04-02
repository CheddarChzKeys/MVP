const refreshTokensDb = require ("../../models/users/refreshTokensDb.js");
const dbClient = require("../../dbAccess.js");
db = dbClient.db("warzone");

const logOut = async (req, res) => {
  const deadRefreshToken = req.body.deadRefreshToken;
  const deleteResult = await refreshTokensDb.delete(deadRefreshToken);
  if (deleteResult.acknowledged) {
    res.send(200, {message: "Refresh token deleted"});
  } else {
    res.send(200, {message: "Refresh token error"})
  }
};

module.exports = logOut;
