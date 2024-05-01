import React, { useState } from "react";
const axios = require("axios").default;
import "regenerator-runtime/runtime";
import SoldierSelectScreen from "./SoldierSelectScreen.js";
import Enlisted from "./Enlisted.js";
import { CSSTransition } from "react-transition-group";

const SignUp = function ({
  toggleSignUp,
  toggleSlideTrans,
  soldierSelectedURL,
  changeSoldierSelectedURL,
  changeSoldierHighlightedURL,
}) {
  const [typedUsername, changeUsername] = useState("");
  const [typedPassword, changePassword] = useState("");
  const [typedPassword2, changePassword2] = useState("");
  const [gamerTag, changeGamerTag] = useState("");
  const [checkedPlatform, changePlatform] = useState(null);
  const [isVerified, changeVerified] = useState(false);
  const [usernameResponse, changeUsernameResponse] = useState("");
  const [pwResponse, changePwResponse] = useState("");
  const [verifyResponse, changeVerifiedResponse] = useState("");
  const [soldierSelectResponse, changeSoldierSelectResponse] = useState("");
  const [showEnlisted, changeShowEnlisted] = useState(false);

  const [showSoldierSelect, toggleSoldierSelect] = useState(false);

  const handleVerify = async (e) => {
    const verifyObject = {
      gamerTag: gamerTag,
      platform: checkedPlatform,
    };
    const results = await axios.post("/users/verifyGamerTag", verifyObject);
    if (results.data === "success") {
      changeVerified(true);
      changeVerifiedResponse("Gamer Tag verified");
    } else {
      changeVerified(false);
      changeVerifiedResponse("Verification failed");
    }
    e.preventDefault(true);
  };

  
  const handleSignUp = (e) => {
    if (typedPassword !== typedPassword2 || typedPassword.length < 1) {
      changePwResponse("Passwords do not match");
    } else if (typedUsername.length < 4) {
      changeUsernameResponse("Username must contain four characters");
    } else {
      const loginObject = {
        username: typedUsername,
        password: typedPassword,
        gamerTag: gamerTag,
        platform: checkedPlatform,
        png: soldierSelectedURL,
      };
      axios.post("/users/signUp", loginObject).then((results) => {
        if (results.data.message === "success") {
          changeShowEnlisted(true);
          toggleSlideTrans(true);
        } else {
          changeUsernameResponse(results.data.message);
        }
      });
    }
    e.preventDefault();
  };
  
  const handleChange = (e, change) => {
    change(e.target.value);
  };

  const handleChecked = (platform) => {
    checkedPlatform === platform
      ? changePlatform(null)
      : changePlatform(platform);
    changeVerified(false);
    changeVerifiedResponse("");
  };

  const handleBack = () => {
    toggleSignUp(false);
    toggleSlideTrans(true);
    changeSoldierSelectedURL(null);
  };

  const handleNext = () => {
    toggleSoldierSelect(true);
    toggleSlideTrans(true);
  };

  return (
    <>
      {!showSoldierSelect && !showEnlisted &&(
        <div id="signUpDiv">
          <p className="logInButtons">Enlist for Service</p>
          <form onSubmit={(e) => handleSignUp(e)}>
            <div>
              <input
                className="textInput"
                id="username"
                placeholder="username"
                type="text"
                value={typedUsername}
                onChange={(e) => {
                  handleChange(e, changeUsername);
                  changeUsernameResponse("");
                }}
              ></input>
              <div className="loginResponse">
                {usernameResponse}, &nbsp;
              </div>
            </div>

            <div>
              <input
                className="textInput"
                id="password"
                placeholder="password"
                type="password"
                value={typedPassword}
                onChange={(e) => {
                  handleChange(e, changePassword);
                  changePwResponse("");
                }}
              ></input>
              <div className="loginResponse">&nbsp;</div>
            </div>
            <div>
              <input
                className="textInput"
                id="password2"
                placeholder="confirm password"
                type="password"
                value={typedPassword2}
                onChange={(e) => {
                  handleChange(e, changePassword2);
                  changePwResponse("");
                }}
              ></input>
              <div className="signUpResponse">{pwResponse}, &nbsp;</div>
            </div>
            <input
              className="textInput"
              id="gamerTag"
              placeholder="gamer tag"
              type="text"
              value={gamerTag}
              onChange={(e) => {
                handleChange(e, changeGamerTag);
                changeVerified(false);
                changeVerifiedResponse("");
              }}
            ></input>
            <div>
              <div id="platformDiv">
                <input
                  className="checkbox"
                  id="psnCheck"
                  placeholder="Gamer Tag"
                  type="checkbox"
                  name="psn"
                  checked={checkedPlatform === "psn" ? true : false}
                  onChange={() => handleChecked("psn")}
                  value="psn"
                ></input>
                <div className="checkboxLabel">
                  <p>PSN</p>
                </div>

                <input
                  className="checkbox"
                  id="xblCheck"
                  type="checkbox"
                  name="xbl"
                  checked={checkedPlatform === "xbl" ? true : false}
                  onChange={() => handleChecked("xbl")}
                  value="xbl"
                ></input>
                <div className="checkboxLabel">
                  <p>XBL</p>
                </div>

                <input
                  className="checkbox"
                  id="actiCheck"
                  type="checkbox"
                  name="acti"
                  checked={checkedPlatform === "acti" ? true : false}
                  onChange={() => handleChecked("acti")}
                  value="acti"
                ></input>
                <div className="checkboxLabel">
                  <p>ACTI</p>
                </div>
              </div>
              <div className="signUpResponse">{verifyResponse}, &nbsp;</div>
              <div className="signUpResponse">
                {soldierSelectResponse}, &nbsp;
              </div>
            </div>
            <div className="loginButtonsWrapper">
              {isVerified ? (
                soldierSelectedURL ? (
                  <input
                    className="logInButtons blueHover pointerHover"
                    type="submit"
                    value="Enlist"
                  ></input>
                ) : (
                  <input
                    className="logInButtons blueHover pointerHover"
                    type="button"
                    value="Next"
                    onClick={handleNext}
                  ></input>
                )
              ) : (
                <input
                  className="logInButtons blueHover pointerHover"
                  type="button"
                  value="Verify"
                  onClick={(e) =>
                    handleVerify(e)
                  }
                ></input>
              )}
              <div
                className="logInButtons blueHover pointerHover"
                onClick={handleBack}
              >
                Back
              </div>
            </div>
          </form>
        </div>
      )}
      {!showSoldierSelect && showEnlisted && (
        <Enlisted handleBack ={handleBack}/>
      )}
      {showSoldierSelect && (
        <SoldierSelectScreen
          toggleSoldierSelect={toggleSoldierSelect}
          soldierSelectedURL={soldierSelectedURL}
          changeSoldierSelectedURL={changeSoldierSelectedURL}
          changeSoldierHighlightedURL={changeSoldierHighlightedURL}
          changeSoldierSelectResponse={changeSoldierSelectResponse}
          toggleSlideTrans={toggleSlideTrans}
        />
      )}
    </>
  );
};

export default SignUp;
