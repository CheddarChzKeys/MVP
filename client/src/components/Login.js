import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import SignUp from "./SignUp.js";
const axios = require("axios").default;

const Login = ({ changeBackground, changeSignedInUser, toggleSignedIn }) => {
  const [typedUsername, changeUsername] = useState("");
  const [typedPassword, changePassword] = useState("");
  const [loginMessage, changeMessage] = useState(" ");
  const [signUpVisible, toggleSignUp] = useState(false);

  changeBackground("../Backgrounds/reaper.jpg");

  const handleLogin = (e) => {
    const loginObject = { username: typedUsername, password: typedPassword };
    axios.post("/login", loginObject).then((results) => {
      changeMessage(results.data.message);
      console.log(results);
      if (results.data.user) {
        changeSignedInUser(results.data.user.username);
        toggleSignedIn(true);
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

  return signUpVisible ? (
    <SignUp />
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
        <div id="loginResponse"> {loginMessage}</div>
        <input
          className="blueHover"
          id="submit"
          placeholder="password"
          type="submit"
        ></input>
      </form>
      <h3 className="blueHover" onClick={() => handleSignUp()}>
        Enlist
      </h3>
    </div>
  );
};

export default Login;
