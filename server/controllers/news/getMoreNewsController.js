const dbClient = require("../../dbAccess");
const db = dbClient.db("warzone");

const getMoreNews = (req, res) => {
    const lastArticleDate = req.query.last
      ? req.query.last
      : "2022-03-00T00:00:01Z";
    let collectionCount;
    const newsDB = db.collection("news");
    newsDB
      .find({ publishedAt: { $lt: lastArticleDate } })
      .count((err, result) => {
        if (err) {
          res.send("Database Error Detected:", err);
        } else {
          collectionCount = result;
        }
      });
    newsDB
      .find({ publishedAt: { $lt: lastArticleDate } })
      .sort({ publishedAt: -1 })
      .limit(10)
      .toArray((err, result) => {
        if (err) {
          res.send("Database Error Detected:", err);
        } else {
          const resultObject = {
            result: result,
            loadedAll: false,
          };
          if (result.length === collectionCount) {
            resultObject.loadedAll = true;
          }
          res.send(resultObject);
        }
      });
  };

  module.exports = getMoreNews;