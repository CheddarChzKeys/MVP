const dbClient = require("../../dbAccess");
const db = dbClient.db("warzone");
const newsDb = db.collection("news");

const getNews = (lastArticleDate) => {
    const findObject = lastArticleDate ? { publishedAt: { $lt: lastArticleDate }} : {}
    return newsDb
      .find(findObject)
      .sort({publishedAt: -1 })
      .limit(10)
      .toArray()
}

module.exports = getNews;