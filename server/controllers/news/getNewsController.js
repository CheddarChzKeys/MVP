const getNewsDbCount = require("../../models/news/getNewsDbCount");
const getNewsDb = require("../../models/news/getNewsDb");

const getNews = async (req, res) => {
  try{
  let loadedAll = false;

  const count = await getNewsDbCount();
  const result = await getNewsDb();

  if (count === result.length) {
    loadedAll = true;
  }
  res.send(200, {result: result, loadedAll: loadedAll})
  }
  catch(err) {
  res.send(500, "Error detected: " + err)
  }
};

module.exports = getNews;
