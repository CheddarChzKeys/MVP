const dbClient = require("../../dbAccess");
const db = dbClient.db("warzone");
const galleryDB = db.collection("gallery");

const getNewestGalleryDbContent = () => galleryDB
        .find()
        .sort({ _id: -1 })
        .limit(12)
        .toArray()

module.exports= getNewestGalleryDbContent;