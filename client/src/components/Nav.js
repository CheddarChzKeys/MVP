import React from "react";
import ReactDOM from "react-dom";
import Records from "./Records.js";
import Chat from "./Smackboard.js";
import { Link } from "react-router-dom";

function Nav(props) {
  return (
    <div>
      <Link to="/">
        <div id="navHeader">
          <h1 id="headerTag">eastside WARFARE</h1>
        </div>
      </Link>
      <nav className="nav">
        <Link to="/records">
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
            }}
          >
            records
          </div>
        </Link>
        <Link to="/smackboard">
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
            }}
          >
            smackboard
          </div>
        </Link>
        <div className="navItem">gallery</div>
        <div className="navItem">
          {props.signedInUser ? props.signedInUser.toLowerCase() : ""}
        </div>
      </nav>
    </div>
  );
}

export default Nav;
