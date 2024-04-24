import React, { useState } from "react";
import ReactDOM from "react-dom";
import Records from "./Records.js";
import Chat from "./Smackboard.js";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { ActiveUser } from "../index.js";

function Nav({ toggleSignedIn, activeClicked }) {
  const signedInUser = useContext(ActiveUser);
  console.log("signedInUser: ", signedInUser);

  return (
    <div className="mainHeaderDiv gridBackground">
      <Link to="/">
        <p id="headerTag">Warzone Files</p>
      </Link>
      <nav className="nav">
        <div className="navMenu">
          <div className="navItemBox">
            <Link to="/records">
              <div
                className={
                  activeClicked === "records" ? "navItemClicked" : "navItem"
                }
              >
                RECORDS
              </div>
            </Link>
          </div>
          <div className="navItemBox">
            <Link to="/smackboard">
              <div
                className={
                  activeClicked === "smackboard" ? "navItemClicked" : "navItem"
                }
              >
                SMACKBOARD
              </div>
            </Link>
          </div>
          <div className="navItemBox">
            <Link to="/gallery">
              <div
                className={
                  activeClicked === "gallery" ? "navItemClicked" : "navItem"
                }
              >
                GALLERY
              </div>
            </Link>
          </div>
          <div className="navItemBox">
            <Link to="/news">
              <div
                className={
                  activeClicked === "news" ? "navItemClicked" : "navItem"
                }
              >
                NEWS
              </div>
            </Link>
          </div>
        </div>
        <div className="navWhiteSpace" />
        <div className="userNavMenu">
          {signedInUser ? (
            <>
              <div className="navItemBox">
                <div className="navItemNoHover" id="noHover">
                  {signedInUser.username}
                </div>
              </div>
              <div className="navItemBox">
                <div
                  className="navItem pointerHover"
                  id="userSignOut"
                  onClick={toggleSignedIn}
                >
                  SIGN OUT
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
                  >
                    SIGN IN
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
