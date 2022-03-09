import React from "react";
import { useState } from "react";
import ReactDOM from "react-dom";
import Nav from "./components/Nav.js";
import Records from "./components/Records.js";
import Smackboard from "./components/Smackboard.js";
import News from "./components/News.js";
import Gallery from "./components/Gallery.js";
import Login from "./components/Login.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";

const App = () => {
  const [isSignedIn, changeSignedIn] = useState(false);
  const [signedInUser, changeSignedInUser] = useState(null);

  const toggleSignedIn = () => {
    changeSignedIn(!isSignedIn);
    if (signedInUser) {
      localStorage.removeItem("accessToken");
      const deadRefreshToken = localStorage.getItem("refreshToken");
      if (deadRefreshToken) {
        console.log("found dead refresh token");
        axios.post("/logout", { deadRefreshToken });
      }
      changeSignedInUser(null);
    }
    console.log("toggled Sign In");
  };

  const changeBackgroundImage = (imageURL) => {
    const background = document.getElementById("htmlBody");
    background.style.background = `url(${imageURL}) center center / cover no-repeat fixed`;
  };

  //Check session storage for JWT to check if user has logged in
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  if (accessToken) {
    axios
      .post("/verifyToken", {
        accessToken: accessToken,
        refreshToken: refreshToken,
      })
      .then((results) => {
        console.log("token verification results:", results);
        if (results.data.newAccessToken) {
          localStorage.setItem("accessToken", results.data.newAccessToken);
        }
        changeSignedIn(true);
        changeSignedInUser(results.data.username);
      });
  }

  return (
    <Router>
      <div>
        <Nav
          isSignedIn={isSignedIn}
          signedInUser={signedInUser}
          toggleSignedIn={toggleSignedIn}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Login
                isSignedIn={isSignedIn}
                toggleSignedIn={toggleSignedIn}
                changeSignedInUser={changeSignedInUser}
                changeBackground={changeBackgroundImage}
              />
            }
          />
          <Route
            path="/records"
            element={<Records changeBackground={changeBackgroundImage} />}
          />
          <Route
            path="/smackboard"
            element={
              <Smackboard
                changeBackground={changeBackgroundImage}
                username={signedInUser}
              />
            }
          />
          <Route path="/news" element={<News />} />
          <Route
            path="/gallery"
            element={<Gallery signedInUser={signedInUser} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));

$(document).ready(function () {
  $("html").css({
    background: 'url("./Backgrounds/reaper.jpg")',
    "background-size": "cover",
    "background-repeat": "no-repeat",
    "background-position": "center center",
    "background-attachment": "fixed",
  });
});
