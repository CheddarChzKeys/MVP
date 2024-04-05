const getNewsDbCount = require("../../models/news/getNewsDbCount");
const getNewsDb = require("../../models/news/getNewsDb");

const getMoreNews = async (req, res) => {
  try {
    const lastArticleDate = req.query.last
      ? req.query.last
      : "2024-03-00T00:00:01Z";

    let loadedAll = false;

    const count = await getNewsDbCount(lastArticleDate);
    const result = await getNewsDb(lastArticleDate);

    if (count === result.length) {
      loadedAll = true;
    }
    res.send({ result: result, loadedAll: loadedAll });
  } catch (err) {
    console.log(`Error detected: ${err}`);
    res.send({ result: [], loadedAll: true });
  }
};

module.exports = getMoreNews;
