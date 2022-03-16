import React, { useState, useEffect, useRef } from "react";
import Picker from "emoji-picker-react";
import GifPicker from "react-giphy-picker";
import DropzoneComponent from "./smackDropbox.js";
import ImagePopUp from "./ImagePopUp.js";
const axios = require("axios").default;

const io = require("socket.io-client");

let socket = io();
let updatedChats = [];

socket.on("output", (data) => {
  updatedChats = data;
  console.log("updatedChats: ", updatedChats);
});

function Chatbox({ changeBackground, username }) {
  const [chats, updateChats] = useState([]);
  const [typedMessage, changeMessage] = useState("");
  const [typedVideoLink, changeTypedVideoLink] = useState("");
  const [submittedVideo, changeSubmittedVideo] = useState(null);
  const [showVideoModal, toggleVideoModal] = useState(false);
  const [showEmojiModal, toggleEmojiModal] = useState(false);
  const [showGifModal, toggleGifModal] = useState(false);
  const [submitResponse, changeResponse] = useState("");
  const [qeuedImages, changeQeuedImages] = useState([]);
  const [previewImages, changePreviewImages] = useState([]);
  const [popUpImage, changePopUpImage] = useState(null);
  const [popUpVideo, changePopUpVideo] = useState(null);
  const [showImagePopUp, toggleImagePopUp] = useState(false);

  const userName = username;

  const inputRef = useRef(null);
  const chatBoxRef = useRef();
  const didMountRef = useRef(false);

  changeBackground("../Backgrounds/season1.jpg");

  const addVideoInput = () => {
    toggleVideoModal(true);
  };

  const hideVideoInput = () => {
    toggleVideoModal(false);
  };

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
        if (imageURLs.length < 1) {
          imageURLs = null;
        }
        socket.emit("sendMessage", [
          userName,
          typedMessage,
          imageURLs,
          submittedVideo,
        ]);
        changeMessage("");
        changeQeuedImages([]);
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

  const handleVideoSubmit = (e) => {
    e.preventDefault();
    console.log("prevent dEFAULT!");
    const videoID = typedVideoLink.split("=")[1];
    changeSubmittedVideo(videoID);
    hideVideoInput();
  };

  const scrollToBottom = () => {
    console.log("chat count: ", chats);
    const timeout1 = setTimeout(() => {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }, 1000);
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
    if (didMountRef.current) {
      scrollToBottom();
    } else didMountRef.current = true;
  }, [chats]);

  useEffect(() => {
    console.log("qeued image state:", qeuedImages);
  }, [qeuedImages]);

  return (
    <div className="mainComponent">
      <div id="smackboardComponent">
        <div className="headerWrapper">
          <h1 className="componentHeader smackNewsHeader">Smack Talk</h1>
          <div className="smackNewsHeaderSpacer" />
        </div>
        <div className="smackNewsMain smackMain">
          <div className="smackboardWrapper">
            <div id="chatbox" ref={chatBoxRef}>
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
                    <div className="chatContent">
                      <div id="chatMessage">{chat.message}</div>
                      {chat.gif && (
                        <img
                          className="chatItem"
                          id="chatGif"
                          src={chat.gif.downsized.url}
                        ></img>
                      )}
                      {chat.video && (
                        <div id="ytPlayerWrapper" className="chatItem">
                          <iframe
                            className="ytPlayer"
                            id="player"
                            type="text/html"
                            width="400"
                            height="243"
                            src={`http://www.youtube.com/embed/${chat.video}`}
                            frameBorder="0"
                            allowFullScreen="allowfullscreen"
                            mozallowfullscreen="mozallowfullscreen"
                            msallowfullscreen="msallowfullscreen"
                            oallowfullscreen="oallowfullscreen"
                            webkitallowfullscreen="webkitallowfullscreen"
                          ></iframe>
                        </div>
                      )}
                      {chat.image && (
                        <div id="chatImageWrapper">
                          {chat.image.map((image) => {
                            return (
                              <img
                                className="chatItem"
                                id="chatImg"
                                src={image}
                                onClick={() => imageClick(image)}
                              ></img>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {/* <div id="chatBottom" ref={chatBottom}></div> */}
            </div>
            <div id="chatResponse">{submitResponse}, &nbsp;</div>
            <div id="messageSubmit">
              <div className="formDiv">
                <form id="createMessage" onSubmit={(e) => handleSubmit(e)}>
                  <input
                    id="typedMessage"
                    ref={inputRef}
                    placeholder="Type your message here..."
                    value={typedMessage}
                    onChange={(e) => handleChange(e, changeMessage)}
                  ></input>
                  {/* <input
                    className="smackButton"
                    id="messageSubmitButton"
                    type="submit"
                    value="Send"
                  ></input> */}
                </form>
              </div>
              <div className="buttonsWrapper">
                <div className="smackButtonWrapper">
                  <button
                    className="smackButton iconWrapper"
                    // ${
                    //   submittedVideo ? "videoSubmitted" : ""
                    // }`}
                    type="button"
                    onMouseEnter={addVideoInput}
                    onMouseLeave={hideVideoInput}
                  >
                    <img className="messageIcon" src="./icons/linkIcon.png" />
                  </button>
                </div>

                <div className="smackButtonWrapper">
                  <button
                    className={`smackButton iconWrapper ${
                      submittedVideo ? "videoSubmitted" : ""
                    }`}
                    type="button"
                    onMouseEnter={addVideoInput}
                    onMouseLeave={hideVideoInput}
                  >
                    <img className="messageIcon" src="./icons/videoIcon.png" />
                  </button>
                  {showVideoModal && (
                    <div
                      id="videoSubmitDiv"
                      onMouseEnter={addVideoInput}
                      onMouseLeave={hideVideoInput}
                    >
                      <div id="videoInput">
                        <form
                          id="videoForm"
                          onSubmit={(e) => {
                            e.stopPropagation();
                            handleVideoSubmit(e);
                          }}
                        >
                          <input
                            id="ytLinkInput"
                            type="text"
                            placeholder="Insert YouTube link..."
                            value={typedVideoLink}
                            onChange={(e) =>
                              handleChange(e, changeTypedVideoLink)
                            }
                          ></input>
                          <input
                            id="videoSubmit"
                            type="submit"
                            value="submit"
                          ></input>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
                <div className="smackButtonWrapper">
                  <button
                    className="smackButton iconWrapper"
                    type="button"
                    onMouseEnter={addGif}
                    onMouseLeave={hideGif}
                  >
                    <img className="messageIcon" src="./icons/gifIcon.png" />
                  </button>
                  {showGifModal && (
                    <div
                      id="pickerDiv"
                      onMouseEnter={addGif}
                      onMouseLeave={hideGif}
                    >
                      <GifPicker id="emojiPicker" onSelected={onGifClick} />
                    </div>
                  )}
                </div>
                <div className="smackButtonWrapper">
                  <button
                    className="smackButton iconWrapper"
                    type="button"
                    onMouseEnter={addEmoji}
                    onMouseLeave={hideEmoji}
                  >
                    <img className="messageIcon" src="./icons/emojiIcon.png" />
                  </button>
                  {showEmojiModal && (
                    <div
                      id="pickerDiv"
                      onMouseEnter={addEmoji}
                      onMouseLeave={hideEmoji}
                    >
                      <Picker id="emojiPicker" onEmojiClick={onEmojiClick} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bannerWrapper">
            <img
              className="bannerImage"
              src="./Images/wzDiscordDraft1.png"
            ></img>
            <a href="https://discord.gg/2X6Y45Zt">
              <div className="bannerMask">
                {/* <div className="maskImageWrapper"> */}
                <img
                  className="maskImage"
                  src="./Images/wzDiscordMask.png"
                ></img>
                {/* </div> */}
              </div>
            </a>
          </div>
        </div>
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
