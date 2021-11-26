import React from "react";
import { useState } from "react";
import ReactDOM from "react-dom";
import Nav from "./components/Nav.js";
import Records from "./components/Records.js";
import Smackboard from "./components/Smackboard.js";
import Login from "./components/Login.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  const [isSignedIn, changeSignedIn] = useState(false);
  const [signedInUser, changeSignedInUser] = useState(null);

  const toggleSignedIn = () => {
    changeSignedIn(!isSignedIn);
    if (signedInUser) {
      changeSignedInUser(null);
    }
    console.log("toggled Sign In");
  };

  const changeBackgroundImage = (imageURL) => {
    const background = document.getElementById("htmlBody");
    background.style.background = `url(${imageURL}) center center / cover no-repeat fixed`;
  };

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
