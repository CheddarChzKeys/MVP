import React, { useState, useEffect, useRef } from "react";
import Picker from "emoji-picker-react";
import GifPicker from "react-giphy-picker";
import DropzoneComponent from "./Dropbox.js";
import ImagePopUp from "./ImagePopUp.js";
const axios = require("axios").default;

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
  const [showGifModal, toggleGifModal] = useState(false);
  const [submitResponse, changeResponse] = useState("");
  const [qeuedImages, changeQeuedImages] = useState([]);
  const [previewImages, changePreviewImages] = useState([]);
  const [popUpImage, changePopUpImage] = useState(null);
  const [popUpVideo, changePopUpVideo] = useState("v4y1VXGEay4");
  const [showImagePopUp, toggleImagePopUp] = useState(false);

  const userName = username;

  const inputRef = useRef(null);
  const chatBottom = useRef(null);

  changeBackground("../Backgrounds/season1.jpg");

  const addEmoji = () => {
    toggleEmojiModal(true);
  };

  const hideEmoji = () => {
    toggleEmojiModal(false);
  };

  const addGif = () => {
    toggleGifModal(true);
  };

  const hideGif = () => {
    toggleGifModal(false);
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

  const onGifClick = (gif) => {
    if (userName) {
      socket.emit("sendGif", [userName, gif]);
      console.log(gif);
    }
  };

  const handleChange = (e, field) => {
    field(e.target.value);
  };

  const getDateStamp = (today) => {
    return today.toLocaleString();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName) {
      changePreviewImages([]);
      changeResponse("creating post");
      return Promise.all(
        qeuedImages.map(async (image) => {
          const imgRequestURL =
            "https://sqv15xg515.execute-api.us-east-1.amazonaws.com/default/getPresignedImageURL";
          const pngRequestURL =
            "https://g8nghet20e.execute-api.us-east-1.amazonaws.com/default/getPresignedImageURLpng";

          const presignedRequestUrl =
            image.type === "image/png" ? pngRequestURL : imgRequestURL;
          const contentType =
            image.type === "image/png" ? "image/png" : "image/jpeg";

          const PresignedUrlObject = await axios.get(presignedRequestUrl);

          const response = await fetch(PresignedUrlObject.data.uploadURL, {
            method: "PUT",
            headers: { "Content-Type": contentType },
            body: image,
          });
          return response.url.split("?")[0];
        })
      ).then((imageURLs) => {
        socket.emit("sendMessage", [userName, typedMessage, imageURLs]);
        changeMessage("");
        changeQeuedImages(null);
        changeResponse("post complete");
        const messageFlash = setTimeout(() => {
          changeResponse("");
        }, 2500);
      });
    } else {
      changeResponse("Please sign in to chat");
      const messageFlash = setTimeout(() => {
        changeResponse("");
      }, 2500);
    }
  };

  const scrollToBottom = () => {
    chatBottom.current.scrollIntoView();
  };

  const imageClick = (image) => {
    changePopUpImage(image);
    toggleImagePopUp(true);
  };

  useEffect(() => {
    socket.on("output", (data) => {
      updatedChats = data;
      updateChats(updatedChats);
    });
    updateChats(updatedChats);
  });

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  useEffect(() => {
    console.log("qeued image state:", qeuedImages);
  }, [qeuedImages]);

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
                {chat.gif ? (
                  <img id="chatGif" src={chat.gif.downsized.url}></img>
                ) : (
                  <div />
                )}
                {chat.image ? (
                  <div id="chatImageWrapper">
                    {chat.image.map((image) => {
                      return (
                        <img
                          id="chatGif"
                          src={image}
                          onClick={() => imageClick(image)}
                        ></img>
                      );
                    })}
                  </div>
                ) : (
                  <div />
                )}
              </div>
            );
          })}
          <div id="chatBottom" ref={chatBottom}></div>
          {showEmojiModal && (
            <div
              id="pickerDiv"
              onMouseEnter={addEmoji}
              onMouseLeave={hideEmoji}
            >
              <Picker id="emojiPicker" onEmojiClick={onEmojiClick} />
            </div>
          )}
          {showGifModal && (
            <div id="pickerDiv" onMouseEnter={addGif} onMouseLeave={hideGif}>
              <GifPicker id="emojiPicker" onSelected={onGifClick} />
            </div>
          )}
        </div>
        <div id="chatResponse">{submitResponse}, &nbsp;</div>
        <form id="createMessage" onSubmit={(e) => handleSubmit(e)}>
          <div id="messageSubmit">
            <input
              id="typedMessage"
              ref={inputRef}
              placeholder="Type your message here..."
              value={typedMessage}
              onChange={(e) => handleChange(e, changeMessage)}
            ></input>
            <button
              className="smackButton"
              type="button"
              onMouseEnter={addGif}
              onMouseLeave={hideGif}
            >
              gif
            </button>
            <button
              className="smackButton"
              type="button"
              onMouseEnter={addEmoji}
              onMouseLeave={hideEmoji}
            >
              emoji
            </button>
            <input
              className="smackButton"
              type="submit"
              value="Full Send"
            ></input>
          </div>
        </form>
        <DropzoneComponent
          changeQeuedImages={changeQeuedImages}
          previewImages={previewImages}
          changePreviewImages={changePreviewImages}
        />
        <ImagePopUp
          popUpImage={popUpImage}
          popUpVideo={popUpVideo}
          showImagePopUp={showImagePopUp}
          toggleImagePopUp={toggleImagePopUp}
          changePopUpImage={changePopUpImage}
          changePopUpVideo={changePopUpVideo}
        />
      </div>
    </div>
  );
}

export default Chatbox;
