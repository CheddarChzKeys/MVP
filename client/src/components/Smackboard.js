import React from "react";
const io = require("socket.io-client");

let socket = io.connect("http://localhost:3000");

socket.on("welcome", (data) => {
  console.log("Received: ", data);
});

let Chatbox = () => {
  return <div id="chatbox">This is where the Chatbox will be!</div>;
};

export default Chatbox;
