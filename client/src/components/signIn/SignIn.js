import React from "react";
import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignUp from "./SignUp.js";
import { CSSTransition } from "react-transition-group";
const axios = require("axios").default;

const signIn = ({
  signedInUser,
  changeSignedInUser,
  toggleSignedIn,
  changeBackground,
  changeClicked,
  activeClicked,
}) => {
  const [typedUsername, changeUsername] = useState("");
  const [typedPassword, changePassword] = useState("");
  const [loginMessage, changeMessage] = useState(" ");
  const [signUpVisible, toggleSignUp] = useState(false);
  const [slideTrans, toggleSlideTrans] = useState(false);
  const [soldierSelectedURL, changeSoldierSelectedURL] = useState(null);
  const [soldierHighlightedURL, changeSoldierHighlightedURL] = useState(null);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    if (typedUsername === "" || typedPassword === "") {
      changeMessage("Username and Password required")
    } else {
      const loginObject = { username: typedUsername, password: typedPassword };
      axios.post("/users/login", loginObject).then((results) => {
        if (results.data.message){
        changeMessage(results.data.message);
        } else if (results.data.user) {
          //retrieve and save JWT in local storage
          const accessToken = results.data.accessToken;
          const refreshToken = results.data.refreshToken;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          changeSignedInUser(results.data.user);
          navigate("/records");
        }
      });
    }
    e.preventDefault();
  };

  const handleChange = (e, change) => {
    change(e.target.value);
    changeMessage("");
  };

  const showSignUp = () => {
    toggleSlideTrans(true);
    toggleSignUp(true);
    changeMessage("");
  };

  const handlePreviewImage = () => {
    if (soldierSelectedURL) {
      return (
        <div id="mwLogo">
          <img
            src={
              "https://mywarzoneappbucket.s3.us-west-1.amazonaws.com/" +
              soldierSelectedURL +
              "_full.png"
            }
          />
        </div>
      );
    } else if (soldierHighlightedURL) {
      return (
        <div id="mwLogo">
          <img
            src={
              "https://mywarzoneappbucket.s3.us-west-1.amazonaws.com/" +
              soldierHighlightedURL +
              "_full.png"
            }
          />
        </div>
      );
    } else {
      return (
        <div id="mwLogo">
          <img src="./Images/mwLogo.png"></img>
        </div>
      );
    }
  };

  useEffect(() => {
    changeBackground("../Backgrounds/nebulaBackground.png");
    changeClicked("signIn");
    toggleSlideTrans(true);
  }, []);

  return (
    <div className="mainComponent">
      <div id="logoLogin">
        <CSSTransition
          in={activeClicked === "signIn"}
          timeout={1000}
          classNames="galleryListSlideRight"
        >
          {handlePreviewImage()}
        </CSSTransition>
        <CSSTransition
          in={slideTrans}
          timeout={1000}
          classNames="signInSlideLeft"
          onEntered={() => toggleSlideTrans(false)}
        >
          <div id="loginWrap">
            {!signUpVisible && (
              <div id="loginDiv">
                {signedInUser ? (
                  <p className="logInButtons">Welcome Back</p>
                ) : (
                  <p className="logInButtons">Welcome Soldier</p>
                )}
                {!signedInUser ? (
                  <form onSubmit={(e) => handleLogin(e)}>
                    <input
                      className="textInput"
                      id="username"
                      placeholder="username"
                      type="text"
                      onChange={(e) => handleChange(e, changeUsername)}
                    ></input>
                    <input
                      className="textInput"
                      id="password"
                      placeholder="password"
                      type="password"
                      onChange={(e) => handleChange(e, changePassword)}
                    ></input>
                    <div className="loginResponse"> {loginMessage} &nbsp;</div>
                    <input
                      className="logInButtons blueHover pointerHover"
                      type="submit"
                      value="Sign In"
                    ></input>
                  </form>
                ) : (
                  <div className="blueLink">{signedInUser.username}</div>
                )}
                {signedInUser ? (
                  <div
                    className="logInButtons blueHover pointerHover"
                    onClick={() => {
                      toggleSignedIn();
                      changeMessage("");
                    }}
                  >
                    Sign Out
                  </div>
                ) : (
                  <div
                    className="logInButtons blueHover pointerHover"
                    onClick={showSignUp}
                  >
                    Enlist
                  </div>
                )}
              </div>
            )}
            {signUpVisible && (
              <SignUp
                toggleSignUp={toggleSignUp}
                toggleSlideTrans={toggleSlideTrans}
                soldierSelectedURL={soldierSelectedURL}
                changeSoldierSelectedURL={changeSoldierSelectedURL}
                changeSoldierHighlightedURL={changeSoldierHighlightedURL}
              />
            )}
          </div>
        </CSSTransition>
      </div>
    </div>
  );
};

export default signIn;
