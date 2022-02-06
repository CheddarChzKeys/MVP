import React from "react";

function ImagePopUp(props) {
  return props.showImagePopUp ? (
    <div className="popUp">
      <div className="fullImageWrapper">
        <div className="fullImageInner">
          <div className="buttonWrapper">
            <button
              className="closeButton"
              onClick={() => props.toggleImagePopUp(false)}
            >
              X
            </button>
          </div>
          <img className="fullImage" src={props.popUpImage} />
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}

export default ImagePopUp;
