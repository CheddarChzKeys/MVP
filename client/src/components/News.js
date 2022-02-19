import React, { useState, useEffect } from "react";
import axios from "axios";

const News = () => {
  const [articles, updateArticles] = useState([]);
  // const [showContent, toggleShowContent] = useState(null);

  let counter = 0;

  const increaseCounter = () => {
    counter += 1;
    console.log("counter:", counter);
  };

  // const handleMouseEnter = (articleNum) => {
  //   toggleShowContent(articleNum);
  // };

  // const handleMouseLeave = () => {
  //   toggleShowContent(null);
  // };

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
      <div className="componentBox" id="newsComponent">
        <h1 className="componentHeader">Latest News</h1>
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
                    </div>
                  </div>
                  <div className="articleImageWrapper">
                    <img
                      className="articleImage"
                      src={article.urlToImage}
                    ></img>
                  </div>
                </div>
                <div className="contentWrapper">
                  <p className="content">{article.content.split("[")[0]}</p>
                </div>
                {increaseCounter()}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default News;
