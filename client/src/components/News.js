import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import { ActiveUser } from "./ActiveUserContext.js";
import axios from "axios";
import { css } from "@emotion/react";
import MoonLoader from "react-spinners/MoonLoader";
import { CSSTransition } from "react-transition-group";

const News = ({ changeBackground }) => {
  const { activeClicked, changeClicked } = useContext(ActiveUser);

  changeClicked("news");
  changeBackground("./Backgrounds/roze.png");

  const [articles, updateArticles] = useState([]);
  const [highlightArticle, toggleHighlightArticle] = useState(null);
  const [oldestArticle, changeOldestArticle] = useState(null);
  const [loading, changeLoading] = useState(false);
  const [loadedAll, changeLoadedAll] = useState("false");

  const observer = useRef();

  const lastArticleRef = useCallback(
    (node) => {
      console.log("useCallback activated");
      if (loading) {
        console.log("loading is true");
        return;
      } else {
        console.log("RUNNING USECALLBACK");
        if (observer.current) {
          console.log("Disconnecting observer.current");
          observer.current.disconnect();
        }
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && !loadedAll) {
            console.log("node is intersecting");
            changeLoadedAll(true);
            getOlderArticles();
          }
        });
        if (node) {
          console.log("Connecting new observer node");
          observer.current.observe(node);
        }
        console.log("Here's the first chat node:", node);
      }
    },
    [loading, loadedAll, articles]
  );

  const override = css`
    flex: 1;
    display: flex;
    justify-content: flex;
    align-items: center;
    margin: 20vh auto;
  `;

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
    axios.get("/news/getNews").then((results) => {
      const newArticles = results.data.result;
      changeLoadedAll(results.data.loadedAll);
      changeOldestArticle(newArticles[newArticles.length - 1].publishedAt);
      updateArticles(newArticles);
    });``
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
          <CSSTransition
            in={activeClicked === "news"}
            timeout={1000}
            classNames="addGalleryContentMod"
            unmountOnExit
          >
            <div className="articleListWrapper">
              {articles.map((article, index) => {
                const articleNumber = counter;
                return (
                  <a className="articleLink" href={article.url} target="_blank">
                    <div
                      key={article._id}
                      ref={
                        index === articles.length - 1 ? lastArticleRef : null
                      }
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
                            <p
                              className={
                                highlightArticle === articleNumber
                                  ? "sourceDate sourceDateHighlight"
                                  : "sourceDate"
                              }
                            >
                              {parseISOString(article.publishedAt)}
                            </p>
                            <p
                              className={
                                highlightArticle === articleNumber
                                  ? "seeFullArticle seeFullArticleShow"
                                  : "seeFullArticle"
                              }
                            >
                              Read full article
                            </p>
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
              {!loadedAll && (
                <div
                  className="galleryLoadMoreWrapper colorHover pointerHover"
                  onClick={getOlderArticles}
                >
                  <p className="galleryLoadMore">Load More</p>
                </div>
              )}
            </div>
          </CSSTransition>
          {/* <div className="bannerWrapper">
            <img
              className="bannerImage"
              src="./Images/officialNewsBanner3.png"
            ></img>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default News;
