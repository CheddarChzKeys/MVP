const { ObjectId } = require("mongodb");
const dbClient = require("../../dbAccess");

const db = dbClient.db("warzone");
const galleryDb = db.collection("gallery");

const getGalleryCount = (lastId, type) => {
  if (lastId && type === "next") {
    return galleryDb.find({ _id: { $lt: ObjectId(lastId) } }).count();
  } else if (lastId && type === "prev") {
    return galleryDb.find({ _id: { $gt: ObjectId(lastId) } }).count();
  } else {
    return galleryDb.countDocuments();
  }
};

module.exports = getGalleryCount;
