import React, { useState } from "react";
import ReactDOM from "react-dom";
import Records from "./Records.js";
import Chat from "./Smackboard.js";
import { Link } from "react-router-dom";

function Nav(props) {
  const toggleSignedIn = props.toggleSignedIn;
  const [activeClicked, changeClicked] = useState("signIn");

  return (
    <div>
      <Link to="/">
        <div id="navHeader">
          <h1 id="headerTag">eastside WARFARE</h1>
        </div>
      </Link>
      <nav className="nav">
        <div className="navMenu">
          <div className="navItemBox">
            <Link to="/records">
              <div
                className={
                  activeClicked == "records" ? "navItemClicked" : "navItem"
                }
                onClick={() => changeClicked("records")}
              >
                records
              </div>
            </Link>
          </div>
          <div className="navItemBox">
            <Link to="/smackboard">
              <div
                className={
                  activeClicked == "smackboard" ? "navItemClicked" : "navItem"
                }
                onClick={() => changeClicked("smackboard")}
              >
                smackboard
              </div>
            </Link>
          </div>
          <div className="navItemBox">
            <Link to="/gallery">
              <div
                className={
                  activeClicked === "gallery" ? "navItemClicked" : "navItem"
                }
                onClick={() => changeClicked("gallery")}
              >
                gallery
              </div>
            </Link>
          </div>
          <div className="navItemBox">
            <Link to="/news">
              <div
                className={
                  activeClicked === "news" ? "navItemClicked" : "navItem"
                }
                onClick={() => changeClicked("news")}
              >
                news
              </div>
            </Link>
          </div>
        </div>
        <div className="navWhiteSpace" />
        <div className="userNavMenu">
          {props.signedInUser ? (
            <>
              <div className="navItemBox">
                <div className="navItem" id="userLoggedIn">
                  {props.signedInUser.toLowerCase()}
                </div>
              </div>
              <div className="navItemBox">
                <div
                  className="navItem"
                  id="userSignOut"
                  onClick={toggleSignedIn}
                >
                  sign out
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="navItemBox"></div>
              <div className="navItemBox">
                <Link to="/">
                  <div
                    className={
                      activeClicked == "signIn" ? "navItemClicked" : "navItem"
                    }
                    id="navSignIn"
                    onClick={() => changeClicked("signIn")}
                  >
                    sign in
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Nav;
