import React from "react";
import ReactDOM from "react-dom";
import StatsTable from "./StatsTable.js";
import Chat from "./Smackboard.js";

function Nav() {
  return (
    <div>
      <h1 id="headerTag">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;eastside
        WARFARE
      </h1>
      <nav className="nav">
        <div
          className="navItem"
          id="recordsButton"
          onClick={() => {
            $("html").css({
              background: 'url("./Backgrounds/season6.jpg")',
              "background-size": "cover",
              "background-repeat": "no-repeat",
              "background-position": "center center",
              "background-attachment": "fixed",
            });
            ReactDOM.render(<StatsTable />, document.getElementById("app"));
          }}
        >
          records
        </div>
        <div
          className="navItem"
          id="operatorsButton"
          onClick={() => {
            $("html").css({
              background: 'url("./Backgrounds/season1.jpg")',
              "background-size": "cover",
              "background-repeat": "no-repeat",
              "background-position": "center center",
              "background-attachment": "fixed",
            });
            ReactDOM.render(<Chat />, document.getElementById("app"));
          }}
        >
          smackboard
        </div>
        <div className="navItem">gallery</div>
        <div className="navItem">blog</div>
      </nav>
    </div>
  );
}

export default Nav;
