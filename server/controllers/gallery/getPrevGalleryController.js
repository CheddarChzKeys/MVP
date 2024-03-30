const getGalleryDbCount = require ("../../models/gallery/getGalleryDbCount")
const getGalleryDbContent = require ("../../models/gallery/getGalleryDbContent")

const getPrevGalleryContent = async (req, res) => {
  try{
    const firstId = req.query.first;
    let count = await getGalleryDbCount(firstId);
    const result = await getGalleryDbContent(firstId, "prev");
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

module.exports = getPrevGalleryContent;
