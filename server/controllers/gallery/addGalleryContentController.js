const dbClient = require("../../dbAccess");
const addGalleryDbContent = require("../../models/gallery/addGalleryDbContent");

const addGalleryContent = async (req, res) => {
  const newContentItem = req.body;
  try {
    const resultMessage = await addGalleryDbContent(newContentItem);
    res.status(200).send({ message: resultMessage });
  } catch (err) {
    console.log(`Error: ${err}`);
    res.status(500);
  }
};

module.exports = addGalleryContent;
