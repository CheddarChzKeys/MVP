const dbClient = require("../../dbAccess");
const db = dbClient.db("warzone");
const galleryDB = db.collection("gallery");
const {ObjectId} = require("mongodb");

const getNewestGalleryDbContent = (lastId) => {
  const findObject = lastId ? { _id: { $lt: ObjectId(lastId) } } : {};
  return galleryDB
    .find(findObject)
    .sort({ _id: -1 })
    .limit(12)
    .toArray()
}

module.exports= getNewestGalleryDbContent;