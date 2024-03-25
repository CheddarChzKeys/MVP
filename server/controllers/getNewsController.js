const dbClient = require("../dbAccess");

const getNews = (req, res) => {
  const db = dbClient.db("warzone");
  const newsDB = db.collection("news");
  const collectionCount = newsDB.count();
  newsDB
    .find()
    .sort({ publishedAt: -1 })
    .limit(10)
    .toArray((err, result) => {
      if (err) {
        res.send("Error detected: " + err);
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

module.exports = getNews;
