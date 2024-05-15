import React, { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";

const itemView = function ({
  selectedItem,
  toggleImagePopUp,
  changePopUpImage,
  changePopUpVideo,
  selectedAnimation,
  toggleSelectedAnimation,
}) {
  const [showVideoDetails, toggleShowVideoDetails] = useState(false);

  const imageClick = (item) => {
    if (item.image) {
      changePopUpImage(item.image);
    } else {
      changePopUpVideo(item.video);
    }
    toggleImagePopUp(true);
  };

  useEffect(() => {
    toggleShowVideoDetails(false);
  }, [selectedItem]);

  return (
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
                  src={`http://www.youtube.com/embed/${selectedItem.video}?autoplay=1&enablejsapi=1`}
                  frameBorder="0"
                  allowFullScreen="allowfullscreen"
                  mozallowfullscreen="mozallowfullscreen"
                  msallowfullscreen="msallowfullscreen"
                  oallowfullscreen="oallowfullscreen"
                  webkitallowfullscreen="webkitallowfullscreen"
                ></iframe>
              </div>
            )}
            <div
              className="expand pointerHover colorHover"
              onClick={() => imageClick(selectedItem)}
            >
              expand
            </div>
            <div className="itemDetails">
              <div className="galleryUserWrapper">
                <div className="galleryUserThumb">
                  <img
                    className="userThumbImage"
                    src={`https://mywarzoneappbucket.s3.us-west-1.amazonaws.com/${selectedItem.png}_largeThumb.png`}
                  />
                </div>
                <p id="source" className="usernameDate">
                  {selectedItem.userName}
                </p>
                <p id="date" className="detailsDate">
                  {selectedItem.uploadDate}
                </p>
              </div>
              <>
                {selectedItem.description && (
                  <p className="detailsDescription">
                    {selectedItem.description}
                  </p>
                )}
                {
                  /* {selectedItem.details && ( */
                  // <div className="videoDetails ">
                  //   {showVideoDetails ? (
                  //     <div
                  //       className="detailsLabel pointerHover"
                  //       onClick={handleShowVideoDetails}
                  //     >
                  //       Video Details &#x25BE;
                  //     </div>
                  //   ) : (
                  //     <div
                  //       className="detailsLabel pointerHover"
                  //       onClick={handleShowVideoDetails}
                  //     >
                  //       Video Details &#x25B8;
                  //     </div>
                  //   )}
                  //   {showVideoDetails && (
                  //     <>
                  //       <p id="title" className="detailsDescriptionTitle">
                  //         {selectedItem.details.snippet.title}
                  //       </p>
                  //       <p id="views" className="detailsDescriptionSmall">
                  //         {selectedItem.details.statistics.viewCount} views
                  //       </p>
                  //       <p id="likes" className="detailsDescriptionSmall">
                  //         {selectedItem.details.statistics.likeCount} likes
                  //       </p>
                  //       <p id="channel" className="detailsDescriptionTitle">
                  //         {selectedItem.details.snippet.channelTitle}
                  //       </p>
                  //       <p className="detailsDescriptionSmall">
                  //         {selectedItem.details.snippet.description}
                  //       </p>
                  //     </>
                  //   )}
                  // </div>
                  // )
                }
              </>
            </div>
          </div>
        ) : (
          <div />
        )}
      </CSSTransition>
    </div>
  );
};

export default itemView;
