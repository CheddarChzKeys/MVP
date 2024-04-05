const dbClient = require("../../dbAccess");
const addGalleryDbContent = require("../../models/gallery/addGalleryDbContent");

const addGalleryContent = async (req, res) => {
  const newContentItem = req.body;
  try {
    const resultMessage = await addGalleryDbContent(newContentItem);
    res.send(200, { message: resultMessage });
  } catch (err) {
    console.log(`Error: ${err}`);
    res.status(500);
  }
};

module.exports = addGalleryContent;
