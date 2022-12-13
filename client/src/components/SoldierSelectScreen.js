import React from "react";
import Carousel from "react-elastic-carousel";

const SoldierSelectScreen = ({
  toggleSlideTrans,
  toggleSoldierSelect,
  soldierSelectedURL,
  changeSoldierSelectedURL,
  changeSoldierSelectResponse,
}) => {
  const imageList = [
    "Homegirl1",
    "Jigsaw1",
    "Johann1",
    "Mace1",
    "Mara1",
    "Operator1",
    "Rambo1",
    "Simi1",
    "Snoop1",
  ];

  const selectSoldier = (imageURL) => {
    const selectedSoldierURL =
      "https://mywarzoneappbucket.s3.us-west-1.amazonaws.com/" +
      imageURL +
      ".png";
    if (soldierSelectedURL === selectedSoldierURL) {
      changeSoldierSelectedURL(null);
      console.log("soldier unselected");
    } else {
      console.log("selectedSoldierURL:", selectedSoldierURL);
      changeSoldierSelectedURL(selectedSoldierURL);
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

  return (
    <div id="soldierSelectWrapper">
      <h3 id="soldierSelectHeading">Soldier Select</h3>
      <Carousel itemsToShow={1} showArrows={false} disableArrowsOnEnd={false}>
        <div className="soldierList">
          {imageList.map((imageURL) => {
            return (
              <div
                className={
                  soldierSelectedURL ===
                  "https://mywarzoneappbucket.s3.us-west-1.amazonaws.com/" +
                    imageURL +
                    ".png"
                    ? "soldierImageWrap soldierImageWrapHover pointerHover"
                    : "soldierImageWrap pointerHover"
                }
                onClick={() => selectSoldier(imageURL)}
              >
                <img
                  className="soldierImage"
                  src={
                    "https://mywarzoneappbucket.s3.us-west-1.amazonaws.com/" +
                    imageURL +
                    ".png"
                  }
                />
              </div>
            );
          })}
        </div>
        <div className="soldierList">
          {imageList.map((imageURL) => {
            return (
              <div
                className={
                  soldierSelectedURL ===
                  "https://mywarzoneappbucket.s3.us-west-1.amazonaws.com/" +
                    imageURL +
                    ".png"
                    ? "soldierImageWrap soldierImageWrapHover pointerHover"
                    : "soldierImageWrap pointerHover"
                }
                onClick={() => selectSoldier(imageURL)}
              >
                <img
                  className="soldierImage"
                  src={
                    "https://mywarzoneappbucket.s3.us-west-1.amazonaws.com/" +
                    imageURL +
                    ".png"
                  }
                />
              </div>
            );
          })}
        </div>
      </Carousel>

      {soldierSelectedURL ? (
        <button
          className="signInButton blueHover pointerHover"
          onClick={handleNext}
        >
          Next
        </button>
      ) : (
        <button
          className="signInButton blueHover pointerHover"
          onClick={handleBack}
        >
          Back
        </button>
      )}
    </div>
  );
};

export default SoldierSelectScreen;
