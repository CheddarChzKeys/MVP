const dbClient = require("../../dbAccess");
const { ObjectId } = require("mongodb");
const getGalleryDbCount = require ("../../models/gallery/getGalleryDbCount")
const getNewestGalleryDbContent = require ("../../models/gallery/getNewestGalleryDbContent")

const getNextGalleryContent = async (req, res) => {
  try{
  const lastId = req.query.last;
  let count = await getGalleryDbCount(lastId);
  const result = await getNewestGalleryDbContent(lastId);
  const loadedAll = count === result.length ? true : false;
  res.send({
    result: result,
    loadedAll: loadedAll
  });
}
catch(err){
  console.log(err);
  res.send("Database error detected: ", err);
}
};

module.exports = getNextGalleryContent;
