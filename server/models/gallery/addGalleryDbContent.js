const dbClient = require("../../dbAccess");
const db = dbClient.db("warzone");
const dbGallery = db.collection("gallery");

const addGalleryDbContent = (newContent) => {
  return dbGallery.insertOne(newContent)
  .then((response, err) => {
    if (err) {
      return ("Error uploading to gallery: ", err);
    } else {
      return ("Successfully uploaded to gallery");
    }
  });
}

module.exports = addGalleryDbContent;