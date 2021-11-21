import React from "react";
import ReactDOM from "react-dom";
import Nav from "./components/Nav.js";
import Records from "./components/Records.js";
import Smackboard from "./components/Smackboard.js";
import Login from "./components/Login.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div>
        <Nav />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/records" element={<Records />} />
          <Route path="/smackboard" element={<Smackboard />} />
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
