import React, { useState, useEffect } from "react";
import axios from "axios";
import AddContentModal from "./AddGalleryContent.js";

const Gallery = (props) => {
  const [contentList, changeContentList] = useState([]);

  const [selectedItem, changeSelectedItem] = useState(null);

  const [showAddContent, changeAddContent] = useState(false);

  const toggleAddContent = () => {
    changeAddContent(!showAddContent);
  };

  const fetchGalleryContent = () => {
    axios.get("/getGalleryContent").then((results) => {
      const newContent = results.data;
      console.log("Gallery fetch results:", results);
      changeContentList(newContent);
      return;
    });
  };

  const handleItemSelect = (clickedItem) => {
    changeSelectedItem(clickedItem);
    return;
  };

  useEffect(() => {
    fetchGalleryContent();
  }, []);

  useEffect(() => {
    changeSelectedItem(contentList[0]);
  }, [contentList]);

  return (
    <div className="mainComponent">
      <div className="gallery">
        <div id="galleryHeaderWrapper" className="headerWrapper">
          <h1 className="galleryHeader">Gallery</h1>
          <h1
            id="addContentButton"
            className="galleryHeader"
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
                        <img
                          className="galleryImage"
                          src={item.image}
                          // onClick={() => imageClick(image)}
                        ></img>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {selectedItem && (
            <div className="itemViewComponentWrapper">
              <div className="itemViewComponent">
                {selectedItem.image && (
                  <div className="imageViewWrapper">
                    <img className="viewPortImage" src={selectedItem.image} />
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
                      src={`http://www.youtube.com/embed/${selectedItem.video}`}
                      frameBorder="0"
                      allowFullScreen="allowfullscreen"
                      mozallowfullscreen="mozallowfullscreen"
                      msallowfullscreen="msallowfullscreen"
                      oallowfullscreen="oallowfullscreen"
                      webkitallowfullscreen="webkitallowfullscreen"
                    />
                  </div>
                )}
                <div className="itemDetails">
                  <p id="source" className="usernameDate">
                    {selectedItem.userName}
                  </p>
                  <p className="usernameDate">{selectedItem.uploadDate}</p>
                  <p className="detailsDescription">
                    {selectedItem.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        {showAddContent && (
          <AddContentModal
            fetchGalleryContent={fetchGalleryContent}
            toggleAddContent={toggleAddContent}
          />
        )}
      </div>
    </div>
  );
};

export default Gallery;
