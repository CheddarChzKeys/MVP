const {ObjectId} = require ("mongodb");
const dbClient = require("../../dbAccess");
const db = dbClient.db("warzone");

const galleryDb = db.collection("gallery");

const getGalleryCount = (lastId) => {
  if (lastId) {
    galleryDb.find({ _id: { $lt: ObjectId(lastId) } }).count((err, result) => {
      if (err) {
        return ("Database Error Detected:", err);
      } else {
        return result;
      }
    })
  } else {
    return galleryDb.countDocuments();
  }
}

module.exports = getGalleryCount;