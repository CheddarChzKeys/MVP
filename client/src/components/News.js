import React, { useState, useEffect } from "react";
import axios from "axios";

const News = () => {
  const [articles, updateArticles] = useState([]);
  const [highlightArticle, toggleHighlightArticle] = useState(null);

  let counter = 0;

  const increaseCounter = () => {
    counter += 1;
    console.log("counter:", counter);
  };

  const handleMouseEnter = (articleNum) => {
    toggleHighlightArticle(articleNum);
  };

  const handleMouseLeave = () => {
    toggleHighlightArticle(null);
  };

  const getNewArticles = () => {
    const newArticles = axios.get("/getNews").then((results) => {
      updateArticles(results.data);
    });
  };

  const parseISOString = (s) => {
    const b = s.split(/\D+/);
    const dateObject = new Date(
      Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6])
    );
    const dateOptions = { weekday: "long", month: "long", day: "numeric" };
    const dateString = dateObject.toLocaleDateString("en-US", dateOptions);
    return dateString;
  };

  useEffect(() => {
    getNewArticles();
  }, []);

  return (
    <div className="mainComponent">
      <div id="newsComponent">
        <div className="headerWrapper">
          <h1 className="componentHeader smackNewsHeader">Latest News</h1>
          <div className="smackNewsHeaderSpacer" />
        </div>
        <div className="smackNewsMain">
          <div className="articleListWrapper">
            {articles.map((article) => {
              const articleNumber = counter;
              return (
                <a className="articleLink" href={article.url}>
                  <div
                    key={article._id}
                    className="article"
                    onMouseEnter={() => handleMouseEnter(articleNumber)}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    <div className="articleTop">
                      <div className="articleTextWrapper">
                        <div className="title">{article.title}</div>
                        <div className="sourceDateWrapper">
                          <p className="sourceDate" id="source">
                            {article.source.name}
                          </p>
                          <p className="sourceDate">
                            {parseISOString(article.publishedAt)}
                          </p>
                          {highlightArticle == articleNumber ? (
                            <p className="sourceDate seeFullArticle">
                              Read full article
                            </p>
                          ) : (
                            <p className="sourceDate" />
                          )}
                        </div>
                        <div className="contentWrapper">
                          <p className="content">
                            {article.content.split("[")[0]}
                          </p>
                        </div>
                      </div>
                      <div className="articleImageWrapper">
                        <img
                          className="articleImage"
                          src={article.urlToImage}
                        ></img>
                      </div>
                    </div>
                    {increaseCounter()}
                  </div>
                </a>
              );
            })}
          </div>
          <div className="bannerWrapper">
            <img
              className="bannerImage"
              src="./Images/officialNewsBanner3.png"
            ></img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
