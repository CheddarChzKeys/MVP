import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
const axios = require("axios").default;

const Login = () => {
  const [typedUsername, changeUsername] = useState("");
  const [typedPassword, changePassword] = useState("");
  const [loginMessage, changeMessage] = useState(" ");

  const handleLogin = (e) => {
    const loginObject = { username: typedUsername, password: typedPassword };
    console.log("handled login");
    axios.post("/login", loginObject).then((results) => {
      changeMessage(results.data.message);
    });
    e.preventDefault();
  };

  const handleChange = (e, change) => {
    change(e.target.value);
    console.log("hello");
  };

  return (
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
          type="text"
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
      <h3 className="blueHover">Enlist</h3>
    </div>
  );
};

export default Login;
