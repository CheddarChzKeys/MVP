import React, { useState, useEffect } from "react";
import axios from "axios";
import AddContentModal from "./AddGalleryContent.js";
import ImagePopUp from "./ImagePopUp.js";
import { css } from "@emotion/react";
import MoonLoader from "react-spinners/MoonLoader";

const Gallery = ({ signedInUser, changeClicked, changeBackground }) => {
  changeClicked("gallery");
  changeBackground("./Backgrounds/reaper.png");

  const [contentList, changeContentList] = useState([]);

  const [selectedItem, changeSelectedItem] = useState(null);

  const [showAddContent, changeAddContent] = useState(false);

  const [popUpImage, changePopUpImage] = useState(null);

  const [showImagePopUp, toggleImagePopUp] = useState(false);

  const [popUpVideo, changePopUpVideo] = useState(null);

  const [newestGalleryItem, changeNewestGalleryItem] = useState(null);

  const [oldestGalleryItem, changeOldestGalleryItem] = useState(null);

  const [loading, changeLoading] = useState(true);

  const [prevLoadedAll, changePrevLoadedAll] = useState(true);
  const [nextLoadedAll, changeNextLoadedAll] = useState(false);

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
      const newContent = result.data.result;
      changeNextLoadedAll(result.data.loadedAll);
      changeNewestGalleryItem(newContent[0]._id);
      changeOldestGalleryItem(newContent[newContent.length - 1]._id);
      changeContentList(newContent);
      changeSelectedItem(newContent[0]);
      changeLoading(false);
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
          return;
        });
  };

  const handleItemSelect = (clickedItem) => {
    changeSelectedItem(clickedItem);
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

  // useEffect(() => {
  //   changeSelectedItem(contentList[0]);
  // }, [contentList]);

  return (
    <div className="mainComponent">
      <div className="gallery">
        <div id="galleryHeaderWrapper" className="headerWrapper">
          <h1 className="galleryHeader">Gallery</h1>
          <h1
            id="addContentButton"
            className="galleryHeader pointerHover colorHover"
            onClick={() => toggleAddContent(true)}
          >
            add Content
          </h1>
          >
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
                          <img className="galleryImage" src={item.image}></img>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
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
          {selectedItem && (
            <div className="itemViewComponentWrapper">
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
                <div className="itemDetails">
                  <p
                    className="expand pointerHover colorHover"
                    onClick={() => imageClick(selectedItem)}
                  >
                    expand
                  </p>
                  <p id="source" className="usernameDate">
                    {selectedItem.userName}
                  </p>
                  <p id="date" className="detailsDate">
                    {selectedItem.uploadDate}
                  </p>
                  {selectedItem.description && (
                    <p className="detailsDescription">
                      {selectedItem.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        {showAddContent && (
          <AddContentModal
            signedInUser={signedInUser}
            getGalleryContent={getGalleryContent}
            toggleAddContent={toggleAddContent}
          />
        )}
        {showImagePopUp && (
          <ImagePopUp
            popUpImage={popUpImage}
            popUpVideo={popUpVideo}
            showImagePopUp={showImagePopUp}
            toggleImagePopUp={toggleImagePopUp}
            changePopUpImage={changePopUpImage}
            changePopUpVideo={changePopUpVideo}
          />
        )}
      </div>
    </div>
  );
};

export default Gallery;
