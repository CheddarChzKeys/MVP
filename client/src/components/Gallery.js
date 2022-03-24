import React, { useState, useEffect } from "react";
import axios from "axios";
import AddContentModal from "./AddGalleryContent.js";
import ImagePopUp from "./ImagePopUp.js";

const Gallery = ({ signedInUser, changeClicked }) => {
  changeClicked("gallery");

  const [contentList, changeContentList] = useState([]);

  const [selectedItem, changeSelectedItem] = useState(null);

  const [showAddContent, changeAddContent] = useState(false);

  const [popUpImage, changePopUpImage] = useState(null);

  const [showImagePopUp, toggleImagePopUp] = useState(false);

  const [popUpVideo, changePopUpVideo] = useState(null);

  const [oldestGalleryItem, changeOldestGalleryItem] = useState(null);

  const toggleAddContent = () => {
    changeAddContent(!showAddContent);
  };

  const getGalleryContent = () => {
    axios.get("/getGalleryContent").then((results) => {
      const newContent = results.data;
      changeOldestGalleryItem(newContent[newContent.length - 1]._id);
      changeContentList(newContent);
      changeSelectedItem(newContent[0]);
      return;
    });
  };

  const getOlderGalleryContent = () => {
    axios
      .get("/getOlderGalleryContent", { params: { last: oldestGalleryItem } })
      .then((results) => {
        const newContent = results.data;
        changeOldestGalleryItem(newContent[newContent.length - 1]._id);
        const newContentList = contentList.slice();
        newContentList.push(...newContent);
        changeContentList(newContentList);
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
            <div
              className="galleryLoadMoreWrapper colorHover pointerHover"
              onClick={getOlderGalleryContent}
            >
              <p className="galleryLoadMore">Load More</p>
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
                      allow="autoplay *"
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
