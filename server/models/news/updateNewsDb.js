const newsAPI = require("newsapi");
const newsApiKey = require("../../../hidden/newsApiKey.js");
const dbClient = require("../../dbAccess.js");
const newsapi = new newsAPI(newsApiKey);

const db = dbClient.db("warzone");
const key = newsApiKey.key;



const updateNewsDb = () => {
  const currentDate = new Date().toISOString().split("T")[0];
  console.log(currentDate);

  const firstOfMonth = currentDate.split("");
  firstOfMonth.splice(8, 2, "01");
  firstOfMonth.join("");

  return newsapi.v2
    .everything({
      q: "+'call of duty' AND warzone",
      from: firstOfMonth,
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
          console.log("newArticleInserted");
        }
      });
      return response;
    })
    .then(() => {
      console.log("almost finished");
      return "finished";
    });
};

module.exports = updateNewsDb;
