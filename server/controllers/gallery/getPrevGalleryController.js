const getGalleryDbCount = require("../../models/gallery/getGalleryDbCount");
const getGalleryDbContent = require("../../models/gallery/getGalleryDbContent");

const getPrevGalleryContent = async (req, res) => {
  try {
    const firstId = req.query.first;
    let count = await getGalleryDbCount(firstId, "prev");
    console.log("COUNT: ", count);
    const result = await getGalleryDbContent(firstId, "prev");
    console.log("RESULTLENGTH: ", result);
    const loadedAll = count === result.length ? true : false;
    res.send({
      result: result,
      loadedAll: loadedAll,
    });
  } catch (err) {
    console.log(`Error: ${err}`);
    res.status(500);
  }
};

module.exports = getPrevGalleryContent;
