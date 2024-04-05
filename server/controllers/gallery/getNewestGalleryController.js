const getGalleryDbCount = require("../../models/gallery/getGalleryDbCount");
const getNewestGalleryDbContent = require("../../models/gallery/getGalleryDbContent");

const getNewestGalleryContent = async (req, res) => {
  try {
    const count = await getGalleryDbCount();
    const result = await getNewestGalleryDbContent();
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

module.exports = getNewestGalleryContent;
