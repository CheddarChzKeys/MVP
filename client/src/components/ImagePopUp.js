import React, { useEffect } from "react";

function ImagePopUp(props) {
  const onClose = () => {
    props.toggleImagePopUp(false);
    props.changePopUpImage(null);
    props.changePopUpVideo(null);
  };

  return (
    <div className="addBackdrop" onClick={onClose}>
      <div className="popUp">
        <div className="fullImageWrapper" onClick={(e) => e.stopPropagation()}>
          <div
            className={
              props.popUpImage ? "inner fullImageInner" : "inner fullVideoInner"
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
            {props.popUpImage && (
              <img className="fullImage" src={props.popUpImage} />
            )}
            {props.popUpVideo && (
              <iframe
                className="ytPlayer"
                id="popUpYTPlayer"
                type="text/html" // width="400"
                // height="243"
                src={`http://www.youtube.com/embed/${props.popUpVideo}`}
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
      </div>
    </div>
  );
}

export default ImagePopUp;
