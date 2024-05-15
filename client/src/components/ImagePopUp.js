import React, { useEffect } from "react";

function ImagePopUp({
  toggleImagePopUp,
  changePopUpImage,
  changePopUpVideo,
  popUpVideo,
  popUpImage,
  selectedItem,
}) {
  const onClose = () => {
    toggleImagePopUp(false);
    if (popUpImage){
      changePopUpImage(null);
    } else {
    changePopUpVideo(null);
    }
  };

  return (
    <div className="addBackdrop" onClick={onClose}>
      <div className="popUp">
        <div className="fullImageWrapper" onClick={(e) => e.stopPropagation()}>
          <div
            className={
              popUpImage ? "inner fullImageInner" : "inner fullVideoInner"
            }
          >
            <div className="buttonWrapper">
              <button
                className="closeButton pointerHover"
                onClick={() => onClose()}
              >
                X
              </button>
            </div>
            {popUpImage && <img className="fullImage" src={popUpImage} />}
            {popUpVideo && (
              <iframe
                className="ytPlayer"
                id="popUpYTPlayer"
                type="text/html" // width="400"
                // height="243"
                src={`http://www.youtube.com/embed/${popUpVideo}`}
                frameBorder="0"
                allowFullScreen="allowfullscreen"
                mozallowfullscreen="mozallowfullscreen"
                msallowfullscreen="msallowfullscreen"
                oallowfullscreen="oallowfullscreen"
                webkitallowfullscreen="webkitallowfullscreen"
              />
            )}
          </div>
        </div>
        {popUpVideo && (
          <div className="videoDetails" onClick={(e) => e.stopPropagation()}>
            <>
              <p id="title" className="detailsDescriptionTitle">
                {selectedItem.details.snippet.title}
              </p>
              <p id="views" className="detailsDescriptionSmall">
                {selectedItem.details.statistics.viewCount} views
              </p>
              <p id="likes" className="detailsDescriptionSmall">
                {selectedItem.details.statistics.likeCount} likes
              </p>
              <p id="channel" className="detailsDescriptionTitle">
                {selectedItem.details.snippet.channelTitle}
              </p>
              <p className="detailsDescriptionSmall">
                {selectedItem.details.snippet.description}
              </p>
            </>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImagePopUp;
