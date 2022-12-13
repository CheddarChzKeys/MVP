import React, { useState } from "react";
const axios = require("axios").default;
import "regenerator-runtime/runtime";
import SoldierSelectScreen from "./SoldierSelectScreen.js";
import { CSSTransition } from "react-transition-group";

const SignUp = ({ toggleSignUp, toggleSlideTrans }) => {
  const [typedUsername, changeUsername] = useState("");
  const [typedPassword, changePassword] = useState("");
  const [typedPassword2, changePassword2] = useState("");
  const [gamerTag, changeGamerTag] = useState("");
  const [checkedPlatform, changePlatform] = useState(null);
  const [isVerified, changeVerified] = useState(true);
  const [soldierSelectedURL, changeSoldierSelectedURL] = useState(null);
  const [usernameResponse, changeUsernameResponse] = useState("");
  const [pwResponse, changePwResponse] = useState("");
  const [verifyResponse, changeVerifiedResponse] = useState("Verify gamertag");
  const [soldierSelectResponse, changeSoldierSelectResponse] = useState("");
  const [isSignedUp, toggleIsSignedUp] = useState(false);

  const [showSoldierSelect, toggleSoldierSelect] = useState(false);

  const handleVerify = async (e, gamerTag, checkedPlatform) => {
    const verifyObject = {
      gamerTag: gamerTag,
      platform: checkedPlatform,
    };
    console.log("verifyObject:", verifyObject);
    const results = await axios.post("/verify", verifyObject);
    if (results.data) {
      changeVerified(true);
      changeVerifiedResponse("Gamer Tag verified");
      console.log("result is: ", results);
      console.log("isVerified =", isVerified);
    } else {
      changeVerified(false);
      changeVerifiedResponse("Verification failed");
    }
    e.preventDefault(true);
  };

  const handleChecked = (platform) => {
    checkedPlatform == platform
      ? changePlatform(null)
      : changePlatform(platform);
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
      axios.post("/signUp", loginObject).then((results) => {
        results.data == "Username already taken"
          ? changeUsernameResponse(results.data)
          : changeVerifiedResponse(results.data);
        toggleIsSignedUp(true);
        changeSoldierSelectResponse("Please sign in");
      });
      //   console.log(results);
      //   if (results.data.user) {
      //     changeSignedInUser(results.data.user.username);
      //     toggleSignedIn(true);
      //   }
      // });
    }
    changePassword("");
    changePassword2("");
    e.preventDefault();
  };

  const handleChange = (e, change) => {
    change(e.target.value);
  };

  const handleBack = () => toggleSignUp();
  const handleNext = () => {
    toggleSoldierSelect(true);
    toggleSlideTrans(true);
  };

  return showSoldierSelect ? (
    <SoldierSelectScreen
      toggleSoldierSelect={toggleSoldierSelect}
      soldierSelectedURL={soldierSelectedURL}
      changeSoldierSelectedURL={changeSoldierSelectedURL}
      changeSoldierSelectResponse={changeSoldierSelectResponse}
      toggleSlideTrans={toggleSlideTrans}
    />
  ) : (
    <div id="signUpDiv">
      <h2>Enlist for Service</h2>
      <form onSubmit={(e) => handleLogin(e)}>
        <div>
          <input
            className="textInput"
            id="username"
            placeholder="username"
            type="text"
            onChange={(e) => {
              handleChange(e, changeUsername);
              changeUsernameResponse("");
            }}
          ></input>
          <div className="loginResponse">{usernameResponse}, &nbsp;</div>
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
            // changeVerifiedResponse("");
          }}
        ></input>
        <div>
          <div id="platformDiv">
            <input
              className="textInput"
              id="psnCheck"
              placeholder="Gamer Tag"
              type="checkbox"
              name="psn"
              checked={checkedPlatform == "psn" ? true : false}
              onChange={() => handleChecked("psn")}
              value="psn"
              // onChange={(e) => handleChange(e, changePassword)}
            ></input>
            <div className="checkboxLabel">
              <p>PSN</p>
            </div>

            <input
              className="textInput"
              id="xblCheck"
              type="checkbox"
              name="xbl"
              checked={checkedPlatform == "xbl" ? true : false}
              onChange={() => handleChecked("xbl")}
              value="xbl"
              // onChange={(e) => handleChange(e, changePassword)}
            ></input>
            <div className="checkboxLabel">
              <p>XBL</p>
            </div>

            <input
              className="textInput"
              id="actiCheck"
              type="checkbox"
              name="acti"
              checked={checkedPlatform == "acti" ? true : false}
              onChange={() => handleChecked("acti")}
              value="acti"
              // onChange={(e) => handleChange(e, changePassword)}
            ></input>
            <div className="checkboxLabel">
              <p>ACTI</p>
            </div>
          </div>
          <div className="signUpResponse">{verifyResponse}, &nbsp;</div>
          <div className="signUpResponse">{soldierSelectResponse}, &nbsp;</div>
        </div>
        <div className="loginButtonsWrapper">
          {isVerified ? (
            isSignedUp ? (
              <button
                className="signInButton blueHover pointerHover"
                onClick={() => toggleSignUp()}
              >
                Sign In
              </button>
            ) : soldierSelectedURL ? (
              <input
                className="blueHover pointerHover"
                id="submit"
                type="submit"
                value="Enlist"
                onClick={(e) => handleSignUp(e)}
              ></input>
            ) : (
              <input
                className="blueHover pointerHover"
                id="submit"
                type="button"
                value="Next"
                onClick={handleNext}
              ></input>
            )
          ) : (
            <input
              className="blueHover pointerHover"
              id="verify"
              type="button"
              value="Verify"
              onClick={(e) => handleVerify(e, gamerTag, checkedPlatform)}
            ></input>
          )}
          <button
            className="signInButton blueHover pointerHover"
            onClick={handleBack}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
