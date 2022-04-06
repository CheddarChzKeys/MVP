import React, { useState, useEffect, useRef } from "react";
import Picker from "emoji-picker-react";
import GifPicker from "react-giphy-picker";
import DropzoneComponent from "./smackDropbox.js";
import ImagePopUp from "./ImagePopUp.js";
import { css } from "@emotion/react";
import MoonLoader from "react-spinners/MoonLoader";
const axios = require("axios").default;

const io = require("socket.io-client");

let socket = io();
let updatedChats = [];

// socket.on("output", (data) => {
//   updatedChats = data;
//   console.log("updatedChats: ", updatedChats);
// });

function Chatbox({ changeClicked, changeBackground, username }) {
  changeClicked("smackboard");
  changeBackground("./Backgrounds/season6.png");

  const [chats, updateChats] = useState([]);
  const [typedMessage, changeMessage] = useState("");
  const [typedVideoLink, changeTypedVideoLink] = useState("");
  const [submittedVideo, changeSubmittedVideo] = useState(null);
  const [showVideoModal, toggleVideoModal] = useState(false);
  const [keepVideoModal, toggleKeepVideoModal] = useState(false);
  const [showEmojiModal, toggleEmojiModal] = useState(false);
  const [showGifModal, toggleGifModal] = useState(false);
  const [submitResponse, changeResponse] = useState("");
  const [qeuedImages, changeQeuedImages] = useState([]);
  const [previewImages, changePreviewImages] = useState([]);
  const [popUpImage, changePopUpImage] = useState(null);
  const [popUpVideo, changePopUpVideo] = useState(null);
  const [showImagePopUp, toggleImagePopUp] = useState(false);
  const [loading, changeLoading] = useState(true);

  const userName = username;

  const override = css`
    align-items: center;
    margin: auto auto;
  `;

  const inputRef = useRef(null);
  const chatBoxRef = useRef();
  const didMountRef = useRef(false);

  const addVideoInput = () => {
    toggleVideoModal(true);
  };

  const hideVideoInput = () => {
    if (!keepVideoModal) {
      toggleVideoModal(false);
    }
  };

  const onClickVideoModal = (e) => {
    e.stopPropagation();
    toggleKeepVideoModal(true);
  };

  const closeAllModals = () => {
    toggleKeepVideoModal(false);
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
      socket.emit("sendGif", {
        userName,
        gif,
      });
      console.log(gif);
    } else {
      changeResponse("Please sign in");
      const messageFlash = setTimeout(() => {
        changeResponse("");
      }, 2500);
    }
  };

  const handleChange = (e, field) => {
    field(e.target.value);
  };

  const getDateStamp = (today) => {
    return today.toLocaleString();
  };

  const parseISOString = (s) => {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
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
        socket.emit("sendMessage", {
          userName,
          typedMessage,
          imageURLs,
          submittedVideo,
        });
        changeMessage("");
        changeQeuedImages([]);
        changeSubmittedVideo(null);
        changeTypedVideoLink("");
        changeResponse("post complete");
        const messageFlash = setTimeout(() => {
          changeResponse("");
        }, 2500);
      });
    } else {
      changeResponse("Please sign in");
      const messageFlash = setTimeout(() => {
        changeResponse("");
      }, 2500);
    }
  };

  const handleVideoSubmit = (e) => {
    e.preventDefault();
    console.log("prevent dEFAULT!");
    let videoID = typedVideoLink;
    const re =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;

    const newVideoID = re.exec(videoID);

    changeSubmittedVideo(newVideoID[1]);
    toggleVideoModal(false);
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

  const getMoreChats = () => {
    socket.emit("getMoreChats", chats[0]._id);
  };

  useEffect(() => {
    socket.on("output", (data) => {
      updatedChats = data.result.reverse();
      console.log("chat result:", data);
      updateChats(updatedChats);
      changeLoading(false);
    });
    socket.emit("getChats");
  }, []);

  useEffect(() => {
    // if (didMountRef.current) {
    //   scrollToBottom();
    // } else {
    //   didMountRef.current = true;
    // }
    socket.on("addOlderChats", (data) => {
      console.log("data.result:", data.result);
      let reversedChats = data.result.slice().reverse();
      console.log("data.result after reverse: ", reversedChats);
      updatedChats = reversedChats.concat(chats);
      updateChats(updatedChats);
    });
  }, [chats]);

  useEffect(() => {
    console.log("qeued image state:", qeuedImages);
  }, [qeuedImages]);

  return (
    <div className="mainComponent" onClick={closeAllModals}>
      <div id="smackboardComponent">
        <div className="headerWrapper">
          <h1 className="componentHeader smackNewsHeader">Smackboard</h1>
          <div className="smackNewsHeaderSpacer" />
        </div>
        <div className="smackNewsMain smackMain">
          <div className="smackboardWrapper">
            {loading ? (
              <MoonLoader
                color="#79d9ff"
                loading={loading}
                css={override}
                size="100"
              />
            ) : (
              <div id="chatbox" ref={chatBoxRef}>
                <div
                  className="galleryLoadMoreWrapper colorHover pointerHover"
                  onClick={getMoreChats}
                >
                  <p className="galleryLoadMore">Load More</p>
                </div>
                {chats.map((chat) => {
                  return (
                    <div id="chat">
                      <div id="nameDate">
                        <div id="chatName">{chat.name}</div>
                        <div id="chatDate">
                          {getDateStamp(new Date()).split(", ")[0] ==
                          getDateStamp(parseISOString(chat.date)).split(", ")[0]
                            ? `Today, ${
                                getDateStamp(parseISOString(chat.date)).split(
                                  ", "
                                )[1]
                              }`
                            : `${getDateStamp(parseISOString(chat.date))}`}
                        </div>
                      </div>
                      <div className="chatContent">
                        <div id="chatMessage">{chat.message}</div>
                        {chat.gif && (
                          <img
                            className="chatItem"
                            id="chatGif"
                            src={chat.gif.downsized.url}
                            onClick={() => imageClick(chat.gif.original.url)}
                          ></img>
                        )}
                        {chat.video && (
                          <div className="ytOutterWrapper">
                            <div id="ytPlayerWrapper" className="chatItem">
                              <iframe
                                className="ytPlayer"
                                id="galleryYTPlayer"
                                type="text/html"
                                // width="400"
                                // height="243"
                                src={`http://www.youtube.com/embed/${chat.video}`}
                                frameBorder="0"
                                allowFullScreen="allowfullscreen"
                                mozallowfullscreen="mozallowfullscreen"
                                msallowfullscreen="msallowfullscreen"
                                oallowfullscreen="oallowfullscreen"
                                webkitallowfullscreen="webkitallowfullscreen"
                              ></iframe>
                            </div>
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
              </div>
            )}
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
                </form>
              </div>
              <div className="buttonsWrapper">
                {/* <div className="smackButtonWrapper">
                  <button
                    className="smackButton iconWrapper"
                    type="button"
                    onMouseEnter={addVideoInput}
                    onMouseLeave={hideVideoInput}
                  >
                    <img className="messageIcon" src="./icons/linkIcon.png" />
                  </button>
                </div> */}

                <div className="smackButtonWrapper">
                  <button
                    className={`smackButton iconWrapper ${
                      submittedVideo ? "videoSubmitted" : ""
                    }`}
                    type="button"
                    onMouseEnter={addVideoInput}
                    onMouseLeave={hideVideoInput}
                    onClick={(e) => onClickVideoModal(e)}
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
                            onClick={(e) => e.stopPropagation()}
                          ></input>
                          <input
                            id="videoSubmit"
                            type="submit"
                            value="submit"
                            onClick={(e) => e.stopPropagation()}
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
                      id="gifPicker"
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
            <DropzoneComponent
              changeQeuedImages={changeQeuedImages}
              previewImages={previewImages}
              changePreviewImages={changePreviewImages}
            />
          </div>
          <div className="bannerWrapper">
            <div id="bannerImageWrapper1" className="bannerImageWrapper">
              <img
                className="smackBannerImage"
                src="./Images/wzDiscordDraft1.png"
              ></img>
              <a href="https://discord.gg/CPWSbZef9D" target="_blank">
                <div className="bannerMask">
                  <div className="maskImageWrapper">
                    <img
                      className="maskImage"
                      src="./Images/wzDiscordMask.png"
                    ></img>
                  </div>
                </div>
              </a>
            </div>
            <div id="bannerImageWrapper2" className="bannerImageWrapper">
              <a
                href="https://www.npmjs.com/package/call-of-duty-api"
                target="_blank"
              >
                <img
                  className="smackBannerImage"
                  src="./Images/cod_Api_Banner.png"
                ></img>
              </a>
            </div>
          </div>
        </div>

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
