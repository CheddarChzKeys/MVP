const newsAPI = require("newsapi");
const newsApiKey = require("../hidden/newsApiKey.js");
const newsapi = new newsAPI(newsApiKey);

const key = newsApiKey.key;

const getNews = (db) => {
  newsapi.v2
    .everything({
      q: "+'call of duty' AND warzone",
      from: "2022-02-16",
      sortBy: "publishedAt",
      apiKey: key,
      domains:
        "gamesradar.com,gamespot.com,gameinformer.com,techradar.com,pcmag.com",
      language: "en",
    })
    .then((response) => {
      const newsDB = db.collection("news");
      const newArticles = response.articles;

      newArticles.map(async (article) => {
        const foundArticle = await newsDB.findOne({ title: article.title });
        if (!foundArticle) {
          newsDB.insertOne(article);
        }
      });
      return response;
    })
    .then((response) => {
      console.log("newsAPI Response:", response);
    });
};

module.exports = {
  getNews: getNews,
};
