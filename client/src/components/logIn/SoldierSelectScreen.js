import React from "react";
import Carousel from "react-elastic-carousel";

const SoldierSelectScreen = ({
  toggleSlideTrans,
  toggleSoldierSelect,
  soldierSelectedURL,
  changeSoldierSelectedURL,
  changeSoldierHighlightedURL,
  changeSoldierSelectResponse,
}) => {
  const imageList = [
    "Homegirl1",
    "Jigsaw1",
    "Johan1",
    "Mace1",
    "Mara1",
    "Operator1",
    "Rambo1",
    "Simi1",
    "Snoop1",
  ];

  const selectSoldier = (imageURL) => {
    if (soldierSelectedURL === imageURL) {
      changeSoldierSelectedURL(null);
    } else {
      changeSoldierSelectedURL(imageURL);
    }
  };

  const handleNext = () => {
    toggleSoldierSelect(false);
    changeSoldierSelectResponse("Soldier selected");
    toggleSlideTrans(true);
  };

  const handleBack = () => {
    toggleSoldierSelect(false);
    toggleSlideTrans(true);
  };

  const highlightSoldier = (imageURL) => {
    changeSoldierHighlightedURL(imageURL);
  };

  return (
    <div id="soldierSelectWrapper">
      <p className="logInButtons" id="soldierSelectHeading">
        Soldier Select
      </p>
      <Carousel itemsToShow={1} showArrows={false} disableArrowsOnEnd={false}>
        <div className="soldierList">
          {imageList.map((imageURL) => {
            return (
              <div
                key={imageURL}
                className={
                  soldierSelectedURL === imageURL
                    ? "soldierImageWrap soldierImageWrapHover pointerHover"
                    : "soldierImageWrap pointerHover"
                }
                onClick={() => selectSoldier(imageURL)}
                onMouseEnter={() => highlightSoldier(imageURL)}
                onMouseLeave={() => highlightSoldier(null)}
              >
                <img
                  className="soldierImage"
                  src={
                    "https://mywarzoneappbucket.s3.us-west-1.amazonaws.com/" +
                    imageURL +
                    "_largeThumb.png"
                  }
                />
              </div>
            );
          })}
        </div>
      </Carousel>

      {soldierSelectedURL ? (
        <div
          className="logInButtons blueHover pointerHover"
          onClick={handleNext}
        >
          Next
        </div>
      ) : (
        <div
          className="logInButtons blueHover pointerHover"
          onClick={handleBack}
        >
          Back
        </div>
      )}
    </div>
  );
};

export default SoldierSelectScreen;
