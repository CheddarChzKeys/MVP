import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AddContentModal from "./AddGalleryContent.js";
import ImagePopUp from "./ImagePopUp.js";
import { css } from "@emotion/react";
import MoonLoader from "react-spinners/MoonLoader";
import { CSSTransition } from "react-transition-group";
import { ActiveUser } from "./ActiveUserContext.js";
import ytAPIKey from "../../../hidden/youtubeAPIv3.js";

const Gallery = ({ changeBackground }) => {
  const { signedInUser, changeClicked } = useContext(ActiveUser);

  changeClicked("gallery");
  changeBackground("./Backgrounds/reaper.png");

  const [contentList, changeContentList] = useState([]);

  const [selectedItem, changeSelectedItem] = useState(null);

  const [showAddContent, changeAddContent] = useState(false);

  const [imageClasses, setImageClasses] = useState("d-none");

  const [popUpImage, changePopUpImage] = useState(null);

  const [showImagePopUp, toggleImagePopUp] = useState(false);

  const [popUpVideo, changePopUpVideo] = useState(null);

  const [newestGalleryItem, changeNewestGalleryItem] = useState(null);

  const [oldestGalleryItem, changeOldestGalleryItem] = useState(null);

  const [loading, changeLoading] = useState(true);

  const [prevLoadedAll, changePrevLoadedAll] = useState(true);
  const [nextLoadedAll, changeNextLoadedAll] = useState(true);

  const [slideTrans, toggleSlideTrans] = useState(false);

  const [gallerySlideLeft, toggleGallerySlideLeft] = useState(true);

  const [selectedAnimation, toggleSelectedAnimation] = useState(false);

  const [showVideoDetails, toggleShowVideoDetails] = useState(false);

  const override = css`
    flex: 1;
    display: flex;
    justify-content: flex;
    align-items: center;
    margin: 20vh auto;
  `;

  const toggleAddContent = () => {
    changeAddContent(!showAddContent);
  };

  const getGalleryContent = () => {
    axios.get("/getGalleryContent").then((result) => {
      if (result.data.result) {
        const newContent = result.data.result;
        changeNewestGalleryItem(newContent[0]._id);
        changeOldestGalleryItem(newContent[newContent.length - 1]._id);
        handleItemSelect(newContent[0]);
        changeNextLoadedAll(result.data.loadedAll);
        changeContentList(newContent);
      }
      toggleSelectedAnimation(true);
      changeLoading(false);
      toggleSlideTrans(true);
      return;
    });
  };

  const getNextGalleryContent = () => {
    !nextLoadedAll &&
      axios
        .get("/getNextGalleryContent", { params: { last: oldestGalleryItem } })
        .then((result) => {
          console.log("result:", result);
          const newContent = result.data.result;
          changePrevLoadedAll(false);
          changeNextLoadedAll(result.data.loadedAll);
          if (newContent.length > 0) {
            changeOldestGalleryItem(newContent[newContent.length - 1]._id);
            changeNewestGalleryItem(newContent[0]._id);
          }
          // const newContentList = contentList.slice();
          // newContentList.push(...newContent);

          changeContentList(newContent);
          console.log("newestGalleryItem:", newestGalleryItem);
          toggleGallerySlideLeft(true);
          toggleSlideTrans(true);
          return;
        });
  };

  const getPrevGalleryContent = () => {
    !prevLoadedAll &&
      axios
        .get("/getPrevGalleryContent", { params: { first: newestGalleryItem } })
        .then((result) => {
          console.log("result:", result);
          const newContent = result.data.result.slice().reverse();
          changeNextLoadedAll(false);
          changePrevLoadedAll(result.data.loadedAll);
          if (newContent.length > 0) {
            changeNewestGalleryItem(newContent[0]._id);
            changeOldestGalleryItem(newContent[newContent.length - 1]._id);
          }
          // const newContentList = contentList.slice();
          // newContentList.push(...newContent);
          changeContentList(newContent);
          toggleGallerySlideLeft(false);
          toggleSlideTrans(true);
          return;
        });
  };

  const handleItemSelect = async (clickedItem) => {
    let newSelectedItem = { ...clickedItem };
    console.log(newSelectedItem);
    const ytDetails = await axios
      .get(
        `https://www.googleapis.com/youtube/v3/videos?id=${clickedItem.video}&key=${ytAPIKey}&part=snippet,statistics`
      )
      .then((result) => {
        return result.data.items[0];
      });
    console.log("ytDetails: ", ytDetails);
    newSelectedItem.details = ytDetails;
    toggleShowVideoDetails(false);
    console.log(newSelectedItem);
    changeSelectedItem(newSelectedItem);
    toggleSelectedAnimation(true);
    return;
  };

  const imageClick = (item) => {
    if (item.image) {
      changePopUpImage(item.image);
    } else {
      changePopUpVideo(item.video);
    }
    toggleImagePopUp(true);
  };

  useEffect(() => {
    getGalleryContent();
  }, []);

  function hideImage() {
    console.log("onExit - executed hide image");
    setImageClasses("d-none");
  }

  function showImage(node) {
    console.log("onEnter");
    setImageClasses("d-block");
    node.style.opacity = 0;
  }

  function removeOpacity(node) {
    console.log("onEntered - executed remove opacity");
    node.style.opacity = 1;
  }

  const handleShowVideoDetails = () => {
    toggleShowVideoDetails(!showVideoDetails);
  };
  return (
    <div className="mainComponent">
      <div className="gallery">
        <div id="galleryHeaderWrapper" className="headerWrapper">
          <h1 className="galleryHeader">GALLERY </h1>
          <h1
            id="addContentButton"
            className="galleryHeader pointerHover colorHover"
            onClick={() => toggleAddContent()}
          >
            ADD CONTENT
          </h1>
        </div>
        <div className="galleryMain">
          <div className="galleryListWrapper">
            {loading ? (
              <MoonLoader
                color="#79d9ff"
                loading={loading}
                css={override}
                size="120px"
              />
            ) : (
              <CSSTransition
                in={slideTrans}
                timeout={1000}
                classNames={
                  gallerySlideLeft
                    ? "galleryListSlideLeft"
                    : "galleryListSlideRight"
                }
                onEntered={() => toggleSlideTrans(false)}
              >
                <div className="galleryList">
                  {contentList.map((item) => {
                    return (
                      <div
                        key={item._id}
                        className="galleryItem"
                        onClick={() => handleItemSelect(item)}
                      >
                        {item.video && (
                          <div className="galleryVideoWrapper">
                            <img
                              className="galleryImage"
                              src={`https://img.youtube.com/vi/${item.video}/hqdefault.jpg`}
                            ></img>
                          </div>
                        )}
                        {item.image && (
                          <div className="galleryImageWrapper">
                            <img
                              className="galleryImage"
                              src={item.image}
                            ></img>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CSSTransition>
            )}

            <div className="galleryLoadMoreWrapper">
              <p
                className={
                  prevLoadedAll
                    ? "galleryLoadMore defaultHover"
                    : "galleryLoadMore colorHover pointerHover"
                }
                onClick={getPrevGalleryContent}
              >
                Prev
              </p>
              <div id="prevNextSeparator"></div>
              <p
                className={
                  nextLoadedAll
                    ? "galleryLoadMore defaultHover"
                    : "galleryLoadMore colorHover pointerHover"
                }
                onClick={getNextGalleryContent}
              >
                Next
              </p>
            </div>
          </div>
          <div className="itemViewComponentWrapper">
            <CSSTransition
              in={selectedAnimation}
              timeout={1000}
              classNames="selectedItemSlide"
              onEntered={() => toggleSelectedAnimation(false)}
            >
              {selectedItem ? (
                <div className="itemViewComponent gridBackground">
                  {selectedItem.image && (
                    <div className="imageViewWrapper pointerHover">
                      <img
                        className="viewPortImage"
                        onClick={() => imageClick(selectedItem)}
                        src={selectedItem.image}
                      />
                    </div>
                  )}
                  {selectedItem.video && (
                    <div className="videoViewWrapper">
                      <iframe
                        className="ytPlayer"
                        id="galleryYTPlayer"
                        type="text/html"
                        // width="400"
                        // height="243"
                        src={`http://www.youtube.com/embed/${selectedItem.video}?autoplay=1&enablejsapi=1`}
                        // allow="autoplay *"
                        frameBorder="0"
                        allowFullScreen="allowfullscreen"
                        mozallowfullscreen="mozallowfullscreen"
                        msallowfullscreen="msallowfullscreen"
                        oallowfullscreen="oallowfullscreen"
                        webkitallowfullscreen="webkitallowfullscreen"
                      ></iframe>
                    </div>
                  )}
                  <btn
                    className="expand pointerHover colorHover"
                    onClick={() => imageClick(selectedItem)}
                  >
                    expand
                  </btn>
                  <div className="itemDetails">
                    <div className="galleryUserWrapper">
                      <div className="galleryUserThumb">
                        <img
                          className="userThumbImage"
                          src="https://mywarzoneappbucket.s3.us-west-1.amazonaws.com/Homegirl1_largeThumb.png"
                        />
                      </div>
                      <p id="source" className="usernameDate">
                        {selectedItem.userName}
                      </p>
                      <p id="date" className="detailsDate">
                        {selectedItem.uploadDate}
                      </p>
                    </div>
                    {selectedItem.description && (
                      <>
                        <p className="detailsDescription">
                          {selectedItem.description}
                        </p>
                        {selectedItem.details && (
                          <div className="videoDetails ">
                            {showVideoDetails ? (
                              <btn
                                className="detailsLabel pointerHover"
                                onClick={handleShowVideoDetails}
                              >
                                Video Details &#x25BE;
                              </btn>
                            ) : (
                              <btn
                                className="detailsLabel pointerHover"
                                onClick={handleShowVideoDetails}
                              >
                                Video Details &#x25B8;
                              </btn>
                            )}
                            {showVideoDetails && (
                              <>
                                <p
                                  id="title"
                                  className="detailsDescriptionTitle"
                                >
                                  {selectedItem.details.snippet.title}
                                </p>
                                <p
                                  id="views"
                                  className="detailsDescriptionSmall"
                                >
                                  {selectedItem.details.statistics.viewCount}{" "}
                                  views
                                </p>
                                <p
                                  id="likes"
                                  className="detailsDescriptionSmall"
                                >
                                  {selectedItem.details.statistics.likeCount}{" "}
                                  likes
                                </p>
                                <p
                                  id="channel"
                                  className="detailsDescriptionTitle"
                                >
                                  {selectedItem.details.snippet.channelTitle}
                                </p>
                                <p className="detailsDescriptionSmall">
                                  {selectedItem.details.snippet.description}
                                </p>
                              </>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div />
              )}
            </CSSTransition>
          </div>
        </div>
        {/* {showAddContent && ( */}
        <CSSTransition
          in={showAddContent}
          timeout={1000}
          classNames="addGalleryContentMod"
          unmountOnExit
        >
          <AddContentModal
            signedInUser={signedInUser}
            getGalleryContent={getGalleryContent}
            toggleAddContent={toggleAddContent}
          />
        </CSSTransition>
        <CSSTransition
          in={showImagePopUp}
          timeout={1000}
          classNames="addGalleryContentMod"
          unmountOnExit
        >
          <ImagePopUp
            popUpImage={popUpImage}
            popUpVideo={popUpVideo}
            showImagePopUp={showImagePopUp}
            toggleImagePopUp={toggleImagePopUp}
            changePopUpImage={changePopUpImage}
            changePopUpVideo={changePopUpVideo}
          />
        </CSSTransition>
      </div>
    </div>
  );
};

export default Gallery;
