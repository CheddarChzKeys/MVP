const dbClient = require("../../dbAccess");
const db = dbClient.db("warzone");

const galleryDb = db.collection("gallery");

const getGalleryCount = () => galleryDb.countDocuments();

module.exports = getGalleryCount;