import React, { useState } from "react";
import Carousel from "react-elastic-carousel";

let accoladeList = [
  { name: "alpha", stat: "kdRatio", description: "Highest KDR" },
  {
    name: "war junkie",
    stat: "matchesPlayed",
    description: "Most matches played",
  },
  {
    name: "headhunter",
    stat: "headshotPercentage",
    description: "Highest headshot percentage",
  },
  {
    name: "deadweight",
    stat: "avgLifeTime",
    description: "Lowest average lifetime",
  },
  { name: "point guard", stat: "assists", description: "Most assists" },
  {
    name: "executioner",
    stat: "executions",
    description: "Most finishing moves",
  },
  {
    name: "warden",
    stat: "gulagKills",
    description: "Most gulag kills",
  },
  {
    name: "tourist",
    stat: "distanceTraveled",
    description: "Longest distance traveled",
  },
];

//Accolade scrollbar functionality

// var button = document.getElementById("arrowsNext");
// button.onclick = function () {
//   var container = document.getElementById("accoladesBox");
//   sideScroll(container, "right", 25, 100, 10);
// };

// var back = document.getElementById("arrowsBack");
// back.onclick = function () {
//   var container = document.getElementById("accoladeBox");
//   sideScroll(container, "left", 25, 100, 10);
// };

function sideScroll(element, direction, speed, distance, step) {
  var scrollAmount = 0;
  var slideTimer = setInterval(function () {
    if (direction == "left") {
      element.scrollLeft -= step;
    } else {
      element.scrollLeft += step;
    }
    scrollAmount += step;
    if (scrollAmount >= distance) {
      window.clearInterval(slideTimer);
    }
  }, speed);
}

var container = React.createRef();

//Accolades component

function Accolades({ weekStats }) {
  const sorted = [...weekStats];

  const sortStat = (accolade, stat) => {
    if (stat === "avgLifeTime") {
      return sorted.sort((a, b) =>
        a[accolade.stat] > b[accolade.stat] ? 1 : -1
      )[0];
    } else {
      return sorted.sort((a, b) =>
        a[accolade.stat] < b[accolade.stat] ? 1 : -1
      )[0];
    }
  };

  return (
    <div>
      <Carousel itemsToShow={4} disableArrowsOnEnd={true}>
        {accoladeList.map((accolade) => {
          return (
            <div className="accolade">
              <div className="accoladeWrapper">
                <img
                  className="accoladeImage"
                  src={"./Images/" + accolade.stat + ".jpeg"}
                ></img>
                {sorted[0] && (
                  <div className="accoladeRanks gridBackground">
                    <div
                      className={
                        sortStat(accolade, accolade.stat).username.length > 10
                          ? "accUsernameSmall ranksItem"
                          : "accUsername ranksItem"
                      }
                    >
                      {sortStat(accolade, accolade.stat).username}
                    </div>
                    <p className="ranksItem">
                      {sortStat(accolade, accolade.stat)[accolade.stat]}
                    </p>
                    <img
                      className="memberImage ranksItem"
                      src={
                        "./Images/" +
                        sortStat(accolade, accolade.stat).username +
                        ".png"
                      }
                    ></img>
                    <div></div>
                  </div>
                )}
              </div>
              <h2 className="accoladeHeader">{accolade.name}</h2>
              <p className="accDescription">{accolade.description}</p>
            </div>
          );
        })}
      </Carousel>
      {/* </div> */}
    </div>
  );
}

export default Accolades;

{
  /* <div id="accoladesBox">
  <div id="accolade">
    <div className="spoiler">
      <img id="accoladeImage" src="./Images/kdrKing.jpeg"></img>
      <div id="accoladeRanks">
        <h2>
          {this.state.accolades[0] ? this.state.accolades[0].username : ""}
        </h2>
        <h1>
          {this.state.accolades[0]
            ? this.state.accolades[0].kdRatio.toFixed(2)
            : ""}
        </h1>
      </div>
    </div>
    <h2 className="accoladeHeader">Juggernaught</h2>
    <p>Highest KDR</p>
  </div>
  <div id="accolade">
    <div className="spoiler">
      <img id="accoladeImage" src="./Images/gamer.jpeg"></img>
      <div id="accoladeRanks">
        <h2>
          {this.state.accolades[0] ? this.state.accolades[0].username : ""}
        </h2>
        <h1>
          {this.state.accolades[0]
            ? this.state.accolades[0].kdRatio.toFixed(2)
            : ""}
        </h1>
      </div>
    </div>
    <h2 className="accoladeHeader">Veteran</h2>
    <p>Most matches played</p>
  </div>
  <div id="accolade">
    <img id="accoladeImage" src="./Images/headHunter.jpeg"></img>
    <h2 className="accoladeHeader">Headhunter</h2>
    <p>Highest headshot percentage</p>
  </div>
  <div id="accolade">
    <img id="accoladeImage" src="./Images/deadWeight.jpeg"></img>
    <h2 className="accoladeHeader">Deadweight</h2>
    <p>Lowest average lifetime</p>
  </div>
  <div id="accolade">
    <img id="accoladeImage" src="./Images/gulagLeader.jpg"></img>
    <h2 className="accoladeHeader">warden</h2>
    <p>Highest Gulag KDR</p>
  </div>
</div>; */
}
