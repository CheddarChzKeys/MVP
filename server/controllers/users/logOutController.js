const dbClient = require("../../dbAccess.js");

const logOut = async (req, res) => {
  db = dbClient.db("warzone");
  const deadRefreshToken = req.body.deadRefreshToken;
  const refreshTokens = db.collection("refreshTokens");
  await refreshTokens.deleteOne({
    refreshToken: deadRefreshToken,
  });
};

module.exports = logOut;
