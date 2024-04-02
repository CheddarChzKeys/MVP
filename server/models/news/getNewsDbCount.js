const {ObjectId} = require ("mongodb");
const dbClient = require("../../dbAccess");

const db = dbClient.db("warzone");
const newsDb = db.collection("news");

const getNewsCount = (lastArticleDate) => {
  if (lastArticleDate) {
    return newsDb.find({ publishedAt: { $lt: lastArticleDate } }).count()
  } else {
    return newsDb.countDocuments();
  }
}

module.exports = getNewsCount;