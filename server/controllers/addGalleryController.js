const dbClient = require("../dbAccess");

const addGalleryContent = (req, res) => {
  const db = dbClient.db("warzone");
  const newContentItem = req.body;
  const dbGallery = db.collection("gallery");
  dbGallery.insertOne(newContentItem).then((response, err) => {
    if (err) {
      res.send({ message: "Error uploading to gallery:" }, err);
    } else {
      res.send({ message: "Successfully uploaded to gallery" });
    }
  });
};

module.exports = addGalleryContent;
