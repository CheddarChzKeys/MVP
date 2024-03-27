const dbClient = require("../dbAccess");

const getNewestGalleryContent = (req, res) => {
  const db = dbClient.db("warzone");
  const galleryDB = db.collection("gallery");
  let collectionCount;
  galleryDB.count((err, result) => {
    if (err) {
      res.send("Database Error Detected: ", err);
    } else {
      collectionCount = result;
    }
  });
  galleryDB
    .find()
    .sort({ _id: -1 })
    .limit(12)
    .toArray((err, result) => {
      if (err) {
        res.send("Database Error Detected:", err);
      } else {
        const resultObject = {
          result: result,
          loadedAll: false,
        };
        console.log("collectionCount: ", collectionCount);
        console.log("result.length: ", result.length);
        if (result.length == collectionCount) {
          console.log("condition should be true");
          resultObject.loadedAll = true;
        }
        console.log("resultObject.loadedAll: ", resultObject.loadedAll);
        res.send(resultObject);
      }
    });
};

module.exports = getNewestGalleryContent;
