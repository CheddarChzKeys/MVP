import React from "react";
import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignUp from "./SignUp.js";
import { CSSTransition } from "react-transition-group";
import { ActiveUser } from "./ActiveUserContext.js";
const axios = require("axios").default;

const Login = ({ changeBackground, toggleSignedIn }) => {
  const [typedUsername, changeUsername] = useState("");
  const [typedPassword, changePassword] = useState("");
  const [loginMessage, changeMessage] = useState(" ");
  const [signUpVisible, toggleSignUp] = useState(false);
  const [slideTrans, toggleSlideTrans] = useState(false);
  const [soldierSelectedURL, changeSoldierSelectedURL] = useState(null);
  const [soldierHighlightedURL, changeSoldierHighlightedURL] = useState(null);

  const { signedInUser, changeSignedInUser, activeClicked, changeClicked } =
    useContext(ActiveUser);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    const loginObject = { username: typedUsername, password: typedPassword };
    axios.post("/users/login", loginObject).then((results) => {
      console.log("RESULTS: ", results)
      changeMessage(results.data.message);
      if (results.data.user) {
        changeSignedInUser(results.data.user);
        toggleSignedIn(true);
        console.log("accessToken: ", results.data.accessToken);
        console.log("refreshToken: ", results.data.refreshToken);
        const accessToken = results.data.accessToken;
        const refreshToken = results.data.refreshToken;
        //retrieve and save JWT in local storage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        navigate("/records");
      }
    });
    changePassword("");
    e.preventDefault();
  };

  const handleChange = (e, change) => {
    change(e.target.value);
  };

  const handleSignUp = () => {
    toggleSlideTrans(true);
    toggleSignUp(!signUpVisible);

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
            {signUpVisible ? (
              <SignUp
                toggleSignUp={handleSignUp}
                toggleSlideTrans={toggleSlideTrans}
                soldierSelectedURL={soldierSelectedURL}
                changeSoldierSelectedURL={changeSoldierSelectedURL}
                changeSoldierHighlightedURL={changeSoldierHighlightedURL}
              />
            ) : (
              <div id="loginDiv">
                <h2>Log In</h2>
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
                    value={typedPassword}
                    onChange={(e) => handleChange(e, changePassword)}
                  ></input>
                  <div className="loginResponse"> {loginMessage} &nbsp;</div>

                  {signedInUser ? (
                    <div />
                  ) : (
                    <input
                      className="blueHover pointerHover"
                      id="submit"
                      type="submit"
                      value="submit"
                    ></input>
                  )}
                </form>
                {signedInUser ? (
                  <h3
                    className="blueHover"
                    onClick={() => {
                      toggleSignedIn();
                      changeMessage("");
                    }}
                  >
                    Sign Out
                  </h3>
                ) : (
                  <h3
                    className="blueHover pointerHover"
                    onClick={() => handleSignUp()}
                  >
                    Enlist
                  </h3>
                )}
              </div>
            )}
          </div>
        </CSSTransition>
      </div>
    </div>
  );
};

export default Login;
