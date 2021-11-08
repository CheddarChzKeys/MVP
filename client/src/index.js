import React from "react";
import ReactDOM from "react-dom";
import Nav from "./components/Nav.js";
import StatsTable from "./components/StatsTable.js";

ReactDOM.render(<Nav />, document.getElementById("header"));

$(document).ready(function () {
  $("html").css({
    background: 'url("./Backgrounds/reaper.jpg")',
    "background-size": "cover",
    "background-repeat": "no-repeat",
    "background-position": "center center",
    "background-attachment": "fixed",
  });
});
