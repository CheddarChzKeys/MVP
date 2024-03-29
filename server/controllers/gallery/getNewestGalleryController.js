const dbClient = require("../../dbAccess");
const getGalleryDbCount = require("../../models/gallery/getGalleryDbCount");
const getNewestGalleryDbContent = require("../../models/gallery/getNewestGalleryDbContent");
const getNewestGalleryContent = async (req, res) => {
  try{
    const count = await getGalleryDbCount();
    const result = await getNewestGalleryDbContent();
    const loadedAll = count === result.length ? true : false;
    res.send({
      result: result,
      loadedAll: loadedAll
    });
  }
  catch{
    res.send("Database error detected")
  }
};


  // const db = dbClient.db("warzone");
  // const galleryDB = db.collection("gallery");
  // let collectionCount;
  // galleryDB.count((err, result) => {
  //   if (err) {
  //     res.send("Database Error Detected: ", err);
  //   } else {
  //     collectionCount = result;
  //   }
  // });
  // galleryDB
  //   .find()
  //   .sort({ _id: -1 })
  //   .limit(12)
  //   .toArray((err, result) => {
  //     if (err) {
  //       res.send("Database Error Detected:", err);
  //     } else {
  //       const resultObject = {
  //         result: result,
  //         loadedAll: false,
  //       };
  //       console.log("collectionCount: ", collectionCount);
  //       console.log("result.length: ", result.length);
  //       if (result.length == collectionCount) {
  //         console.log("condition should be true");
  //         resultObject.loadedAll = true;
  //       }
  //       console.log("resultObject.loadedAll: ", resultObject.loadedAll);
  //       res.send(resultObject);
  //     }
  //   });

module.exports = getNewestGalleryContent;
