const dbClient = require("../../dbAccess");
const { ObjectId } = require("mongodb");

const getPrevGalleryContent = (req, res) => {
  const db = dbClient.db("warzone");
  const firstID = req.query.first
    ? req.query.first
    : "999999999999999999999999";
  let collectionCount;
  const galleryDB = db.collection("gallery");
  galleryDB.find({ _id: { $gt: ObjectId(firstID) } }).count((err, result) => {
    if (err) {
      res.send("Database Error Detected:", err);
    } else {
      collectionCount = result;
    }
  });
  galleryDB
    .find({ _id: { $gt: ObjectId(firstID) } })
    .sort({ _id: 1 })
    .limit(12)
    .toArray((err, result) => {
      if (err) {
        res.send("Database Error Detected:", err);
      } else {
        const resultObject = {
          result: result,
          loadedAll: false,
          collectionCount: collectionCount,
        };
        if (result.length === collectionCount) {
          resultObject.loadedAll = true;
        }
        res.send(resultObject);
      }
    });
};

module.exports = getPrevGalleryContent;
