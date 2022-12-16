import React from "react";
import { useState, createContext } from "react";
import ReactDOM from "react-dom";
import Nav from "./components/Nav.js";
import Records from "./components/Records.js";
import Smackboard from "./components/Smackboard.js";
import News from "./components/News.js";
import Gallery from "./components/Gallery.js";
import Login from "./components/Login.js";
import Footer from "./components/Footer.js";
import { ActiveUser } from "./components/ActiveUserContext.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import "core-js/stable";
import "regenerator-runtime/runtime";

const App = () => {
  const [isSignedIn, changeSignedIn] = useState(false);
  const [signedInUser, changeSignedInUser] = useState(null);
  const [activeClicked, changeClicked] = useState(null);
  const [memberList, changeMemberList] = useState(null);

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

  const changeBackground = (imageURL) => {
    const background = document.getElementById("htmlBody");
    background.style.background = `url(${imageURL}) center center / cover no-repeat fixed`;
  };

  //Get member list
  const getMemberList = () => {
    axios.get("/getMemberList").then((results) => {
      console.log("HERE's the members list:", results.data);
      changeMemberList(results.data);
    });
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
        <ActiveUser.Provider
          value={{
            signedInUser,
            changeSignedInUser,
            activeClicked,
            changeClicked,
          }}
        >
          <Nav toggleSignedIn={toggleSignedIn} />
          <Routes>
            <Route
              path="/"
              element={
                <Login
                  toggleSignedIn={toggleSignedIn}
                  changeBackground={changeBackground}
                />
              }
            />
            <Route
              path="/records"
              element={
                <Records
                  changeBackground={changeBackground}
                  changeClicked={changeClicked}
                  getMemberList={getMemberList}
                  memberList={memberList}
                />
              }
            />
            <Route
              path="/smackboard"
              element={<Smackboard changeBackground={changeBackground} />}
            />
            <Route
              path="/news"
              element={<News changeBackground={changeBackground} />}
            />
            <Route
              path="/gallery"
              element={<Gallery changeBackground={changeBackground} />}
            />
          </Routes>
        </ActiveUser.Provider>
      </div>
      <Footer />
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
