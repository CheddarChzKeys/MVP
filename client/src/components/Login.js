import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignUp from "./SignUp.js";
const axios = require("axios").default;

const Login = ({
  changeBackground,
  changeSignedInUser,
  toggleSignedIn,
  isSignedIn,
}) => {
  const [typedUsername, changeUsername] = useState("");
  const [typedPassword, changePassword] = useState("");
  const [loginMessage, changeMessage] = useState(" ");
  const [signUpVisible, toggleSignUp] = useState(false);

  changeBackground("../Backgrounds/reaper.jpg");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    const loginObject = { username: typedUsername, password: typedPassword };
    axios.post("/login", loginObject).then((results) => {
      changeMessage(results.data.message);
      if (results.data.username) {
        changeSignedInUser(results.data.username);
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
    toggleSignUp(!signUpVisible);
  };

  return (
    <div id="logoLogin">
      <div id="mwLogo">
        <img src="./Images/mwLogo.png"></img>
      </div>
      <div id="loginWrap">
        {signUpVisible ? (
          <SignUp toggleSignUp={handleSignUp} />
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

              {isSignedIn ? (
                <div />
              ) : (
                <input
                  className="blueHover"
                  id="submit"
                  placeholder="password"
                  type="submit"
                ></input>
              )}
            </form>
            {isSignedIn ? (
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
              <h3 className="blueHover" onClick={() => handleSignUp()}>
                Enlist
              </h3>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
