import React from "react";

const Article = function ({
  articles,
  article,
  index,
  highlightArticle,
  toggleHighlightArticle,
  lastArticleRef,
}) {
  const parseISOString = (s) => {
    const b = s.split(/\D+/);
    const dateObject = new Date(
      Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6])
    );
    const dateOptions = { weekday: "long", month: "long", day: "numeric" };
    const dateString = dateObject.toLocaleDateString("en-US", dateOptions);
    return dateString;
  };

  return (
    <a className="articleLink" href={article.url} target="_blank">
      <div
        key={article._id}
        ref={index === articles.length - 1 ? lastArticleRef : null}
        className="article"
        onMouseEnter={() => toggleHighlightArticle(article._id)}
        onMouseLeave={() => toggleHighlightArticle(null)}
      >
        <div className="articleTop">
          <div className="articleTextWrapper">
            <div className="title">{article.title}</div>
            <div className="sourceDateWrapper">
              <p className="sourceDate" id="source">
                {article.source.name}
              </p>
              <p
                className={
                  highlightArticle === article._id
                    ? "sourceDate sourceDateHighlight"
                    : "sourceDate"
                }
              >
                {parseISOString(article.publishedAt)}
              </p>
              <p
                className={
                  highlightArticle === article._id
                    ? "seeFullArticle seeFullArticleShow"
                    : "seeFullArticle"
                }
              >
                Read full article
              </p>
            </div>
            <div className="contentWrapper">
              <p className="content">{article.content.split("[")[0]}</p>
            </div>
          </div>
          <div className="articleImageWrapper">
            <img className="articleImage" src={article.urlToImage}></img>
          </div>
        </div>
      </div>
    </a>
  );
};

export default Article;
