const dbClient = require("../dbAccess");
const { ObjectId } = require("mongodb");

const getNextGalleryContent = (req, res) => {
  console.log("req.query.last: ", req.query.last);
  const db = dbClient.db("warzone");
  const lastID = req.query.last ? req.query.last : "999999999999999999999999";
  let collectionCount;
  const galleryDB = db.collection("gallery");
  galleryDB.find({ _id: { $lt: ObjectId(lastID) } }).count((err, result) => {
    if (err) {
      res.send("Database Error Detected:", err);
    } else {
      collectionCount = result;
    }
  });
  galleryDB
    .find({ _id: { $lt: ObjectId(lastID) } })
    .sort({ _id: -1 })
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
        console.log("RESULT.LENGTH: ", result.length);
        console.log("COLLECTIONCOUNT: ", collectionCount);
        if (result.length === collectionCount) {
          resultObject.loadedAll = true;
        }
        res.send(resultObject);
      }
    });
};

module.exports = getNextGalleryContent;
