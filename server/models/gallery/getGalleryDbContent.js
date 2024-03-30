const dbClient = require("../../dbAccess");
const {ObjectId} = require("mongodb");

const db = dbClient.db("warzone");
const galleryDB = db.collection("gallery");

const getGalleryDbContent = (iD, type) => {
  let findObject = {};
  let sortObject = { _id: -1 };
  if (type === "next") {
    findObject = { _id: { $lt: ObjectId(iD) } }
  } else if (type === "prev") {
    findObject = { _id: { $gt: ObjectId(iD) } }
    sortObject = { _id: 1 }
  }
  return galleryDB
    .find(findObject)
    .sort(sortObject)
    .limit(12)
    .toArray()
}

module.exports= getGalleryDbContent;