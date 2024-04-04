const dbClient = require("../../dbAccess");
const db = dbClient.db("warzone");
const refreshTokens = db.collection("refreshTokens");

const addRefreshTokenDb = (token) =>
  refreshTokens.insertOne({ refreshToken: token });

const deleteRefreshTokenDb = (token) =>
  refreshTokens.deleteOne({ refreshToken: token });

const findRefreshTokenDb = (token) =>
  refreshTokens.findOne({ refreshToken: token });

module.exports = {
  add: addRefreshTokenDb,
  delete: deleteRefreshTokenDb,
  find: findRefreshTokenDb,
};
