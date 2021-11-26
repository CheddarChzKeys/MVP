import React, { useState, useEffect, useRef } from "react";
import Picker from "emoji-picker-react";
const io = require("socket.io-client");

let socket = io.connect("http://localhost:3000");
let updatedChats = [];

socket.on("output", (data) => {
  updatedChats = data;
  console.log(updatedChats);
});

function Chatbox({ changeBackground, username }) {
  const [chats, updateChats] = useState([]);
  const [typedMessage, changeMessage] = useState("");
  const [showEmojiModal, toggleEmojiModal] = useState(false);
  const [submitResponse, changeResponse] = useState("");

  const userName = username;

  const inputRef = useRef(null);

  changeBackground("../Backgrounds/season1.jpg");

  const addEmoji = () => {
    toggleEmojiModal(!showEmojiModal);
  };

  const onEmojiClick = (event, emojiObject) => {
    const { selectionStart, selectionEnd } = inputRef.current;
    const newTypedMessage =
      typedMessage.slice(0, selectionStart) +
      emojiObject.emoji +
      " " +
      typedMessage.slice(selectionEnd);
    changeMessage(newTypedMessage);
  };

  const handleChange = (e, field) => {
    field(e.target.value);
  };

  const getDateStamp = (today) => {
    return today.toLocaleString();
  };

  const handleSubmit = (e) => {
    if (userName) {
      socket.emit("sendMessage", [userName, typedMessage]);
      changeMessage("");
    } else {
      changeResponse("Please sign in to chat");
      const messageFlash = setTimeout(() => {
        changeResponse("");
      }, 2500);
    }
    e.preventDefault();
  };

  useEffect(() => {
    socket.on("output", (data) => {
      updatedChats = data;
      updateChats(updatedChats);
    });
    updateChats(updatedChats);
  });

  return (
    <div className="mainComponent">
      <div className="componentBox" id="smackboard">
        <h1 className="componentHeader">Smack Talk</h1>
        <div id="chatbox">
          {chats.map((chat) => {
            return (
              <div id="chat">
                <div id="nameDate">
                  <div id="chatName">{chat.name}</div>
                  <div id="chatDate">
                    {getDateStamp(new Date()).split(", ")[0] ==
                    chat.date.split(", ")[0]
                      ? `Today, ${chat.date.split(", ")[1]}`
                      : `${chat.date}`}
                  </div>
                </div>
                <div id="chatMessage">{chat.message}</div>
              </div>
            );
          })}
        </div>
        <form id="createMessage" onSubmit={(e) => handleSubmit(e)}>
          <div id="messageSubmit">
            <input
              id="typedMessage"
              ref={inputRef}
              placeholder="Type your message here..."
              value={typedMessage}
              onChange={(e) => handleChange(e, changeMessage)}
            ></input>
            <button className="smackButton" type="button">
              image
            </button>
            <button
              className="smackButton"
              type="button"
              onMouseEnter={addEmoji}
              onMouseLeave={addEmoji}
            >
              emoji
              {showEmojiModal && (
                <Picker id="emojiPicker" onEmojiClick={onEmojiClick} />
              )}
            </button>
            <input
              className="smackButton"
              type="submit"
              value="Full Send"
            ></input>
          </div>
          <div id="chatResponse">{submitResponse}</div>
        </form>
      </div>
    </div>
  );
}

export default Chatbox;
