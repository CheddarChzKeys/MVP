import React from "react";
import Carousel from "react-elastic-carousel";

const SoldierSelectScreen = ({
  toggleSoldierSelect,
  soldierSelectedURL,
  changeSoldierSelectedURL,
  changeSoldierSelectResponse,
}) => {
  const imageList = [
    "JERONIMO_K",
    "jrickross",
    "KiDKEN90",
    "mRey89",
    "nohypejustBEAST",
    "booty_Thumper",
    "Jigsaw1",
    "Johan1",
    "Mace1",
  ];

  const selectSoldier = (imageURL) => {
    const selectedSoldierURL = "./Images/" + imageURL + ".png";
    console.log("selectedSoldierURL:", selectedSoldierURL);
    changeSoldierSelectedURL(selectedSoldierURL);
  };

  const handleNext = () => {
    toggleSoldierSelect(false);
    changeSoldierSelectResponse("Soldier selected");
  };

  const handleBack = () => {
    toggleSoldierSelect(false);
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
                  soldierSelectedURL === "./Images/" + imageURL + ".png"
                    ? "soldierImageWrap soldierImageWrapHover"
                    : "soldierImageWrap"
                }
                onClick={() => selectSoldier(imageURL)}
              >
                <img
                  className="soldierImage"
                  src={"./Images/" + imageURL + ".png"}
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
                  soldierSelectedURL === "./Images/" + imageURL + ".png"
                    ? "soldierImageWrap soldierImageWrapHover"
                    : "soldierImageWrap"
                }
                onClick={() => selectSoldier(imageURL)}
              >
                <img
                  className="soldierImage"
                  src={"./Images/" + imageURL + ".png"}
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
