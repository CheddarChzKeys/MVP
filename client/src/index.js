import React from "react";
import { useEffect, useState, useMemo, createContext } from "react";
import ReactDOM from "react-dom";
import Nav from "./components/Nav.js";
import Records from "./components/Records.js";
import Smackboard from "./components/Smackboard.js";
import News from "./components/news/News.js";
import Gallery from "./components/Gallery.js";
import Login from "./components/Login.js";
import Footer from "./components/Footer.js";
// import { ActiveUser } from "./components/ActiveUserContext.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import "core-js/stable";
import "regenerator-runtime/runtime";

export const ActiveUser = React.createContext();

const App = () => {
  const [isSignedIn, changeSignedIn] = useState(false);
  const [signedInUser, changeSignedInUser] = useState(null);
  const [activeClicked, changeClicked] = useState(null);
  const [memberList, changeMemberList] = useState(null);

  // const newSignedInUser = useMemo(() => signedInUser, [signedInUser]);

  const toggleSignedIn = () => {
    changeSignedIn(!isSignedIn);
    if (signedInUser) {
      localStorage.removeItem("accessToken");
      const deadRefreshToken = localStorage.getItem("refreshToken");
      if (deadRefreshToken) {
        console.log("found dead refresh token");
        axios.post("users/logOut", { deadRefreshToken });
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
    console.log("ATTEMPTING GET MEMBER LIST");
    axios.get("/users").then((results) => {
      console.log("HERE's the members list:", results);
      changeMemberList(results.data);
    });
  };

  //Check session storage for JWT to check if user has logged in
  const checkSession = () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (accessToken) {
      console.log("CHECKING ACCESS TOKEN RESULTS: ", accessToken);
      console.log("CHECKING REFRESH TOKEN RESULTS: ", refreshToken);
      axios
        .post("/users/verifyToken", {
          accessToken: accessToken,
          refreshToken: refreshToken,
        })
        .then((results) => {
          console.log("token verification results:", results);
          if (results.data.newAccessToken) {
            console.log("SETTING NEW ACCESS TOKEN: ", results.data);
            localStorage.setItem("accessToken", results.data.newAccessToken);
          }
          changeSignedIn(true);
          console.log("SIGN IN SUCCESFULL: ", results.data);
          changeSignedInUser(results.data.user);
        });
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <Router>
      <div>
        <ActiveUser.Provider value={signedInUser}>
          <Nav activeClicked={activeClicked} toggleSignedIn={toggleSignedIn} />
        </ActiveUser.Provider>
        <Routes>
          <Route
            path="/"
            element={
              <Login
                toggleSignedIn={toggleSignedIn}
                changeBackground={changeBackground}
                signedInUser={signedInUser}
                changeSignedInUser={changeSignedInUser}
                changeClicked={changeClicked}
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
            element={
              <Smackboard
                signedInUser={signedInUser}
                memberList={memberList}
                changeBackground={changeBackground}
                changeClicked={changeClicked}
                activeClicked={activeClicked}
              />
            }
          />
          <Route
            path="/news"
            element={
              <News
                changeBackground={changeBackground}
                activeClicked={activeClicked}
                changeClicked={changeClicked}
              />
            }
          />
          <Route
            path="/gallery"
            element={
              <ActiveUser.Provider value={signedInUser}>
                <Gallery
                  changeBackground={changeBackground}
                  changeClicked={changeClicked}
                />
              </ActiveUser.Provider>
            }
          />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
