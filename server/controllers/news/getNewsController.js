const getNewsDbCount = require("../../models/news/getNewsDbCount");
const getNewsDb = require("../../models/news/getNewsDb");

const getNews = async (req, res) => {
  try {
    let loadedAll = false;

    const count = await getNewsDbCount();
    const result = await getNewsDb();

    if (count === result.length) {
      loadedAll = true;
    }
    res.send({ result: result, loadedAll: loadedAll });
  } catch (err) {
    console.log(`Error detected: ${err}`);
    res.send({ result: [], loadedAll: true });
  }
};

module.exports = getNews;
