const {ObjectId} = require ("mongodb");
const dbClient = require("../../dbAccess");

const db = dbClient.db("warzone");
const galleryDb = db.collection("gallery");

const getGalleryCount = (lastId) => {
  if (lastId) {
    return galleryDb.find({ _id: { $lt: ObjectId(lastId) } }).count()
  } else {
    return galleryDb.countDocuments();
  }
}

module.exports = getGalleryCount;