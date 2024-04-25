import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import MoonLoader from "react-spinners/MoonLoader";
import { CSSTransition } from "react-transition-group";
import Article from "./Article";

const News = function ({ changeBackground, activeClicked, changeClicked }) {
  const [articles, updateArticles] = useState([]);
  const [highlightArticle, toggleHighlightArticle] = useState(null);
  const [oldestArticle, changeOldestArticle] = useState(null);
  const [loadedAll, changeLoadedAll] = useState(false);

  const observer = useRef();

  const lastArticleRef = useCallback(
    (node) => {
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !loadedAll) {
          changeLoadedAll(true);
          getOlderArticles();
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [loadedAll, articles]
  );

  const getNewArticles = () => {
    axios.get("/news/getNews").then((results) => {
      const newArticles = results.data.result;
      changeLoadedAll(results.data.loadedAll);
      changeOldestArticle(newArticles[newArticles.length - 1].publishedAt);
      updateArticles(newArticles);
    });
    ``;
  };

  const getOlderArticles = () => {
    axios
      .get("/news/getMoreNews", { params: { last: oldestArticle } })
      .then((results) => {
        const olderArticles = results.data.result;
        changeLoadedAll(results.data.loadedAll);
        changeOldestArticle(
          olderArticles[olderArticles.length - 1].publishedAt
        );
        const newArticleList = articles.slice();
        newArticleList.push(...olderArticles);
        updateArticles(newArticleList);
        return;
      });
  };

  useEffect(() => {
    changeClicked("news");
    changeBackground("./Backgrounds/roze.png");
    getNewArticles();
  }, []);

  return (
    <div className="mainComponent">
      <div id="newsComponent">
        <div className="headerWrapper">
          <h1 className="componentHeader">Latest News</h1>
        </div>
        <div className="smackNewsMain">
          <CSSTransition
            in={activeClicked === "news"}
            timeout={1000}
            classNames="addGalleryContentMod"
            unmountOnExit
          >
            <div className="articleListWrapper">
              {articles.map((article, index) => {
                return (
                  <Article
                    key={index}
                    articles={articles}
                    article={article}
                    index={index}
                    highlightArticle={highlightArticle}
                    toggleHighlightArticle={toggleHighlightArticle}
                    lastArticleRef={lastArticleRef}
                  />
                );
              })}
              {!loadedAll && (
                <div className="galleryLoadMoreWrapper colorHover pointerHover">
                  <p className="galleryLoadMore">Load More</p>
                </div>
              )}
            </div>
          </CSSTransition>
        </div>
      </div>
    </div>
  );
};

export default News;
