import React from "react";

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
    "Rambo1",
    "jrickross",
    "KiDKEN90",
    "mRey89",
    "booty_Thumper",
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

  return (
    <div id="soldierSelectWrapper">
      <h3 id="soldierSelectHeading">Soldier Select</h3>
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

      <button
        className="signInButton blueHover pointerHover"
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
};

export default SoldierSelectScreen;
