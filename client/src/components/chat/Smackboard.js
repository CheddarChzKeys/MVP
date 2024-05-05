import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import Picker from "emoji-picker-react";
import GifPicker from "react-giphy-picker";
import DropzoneComponent from "./smackDropbox.js";
import ImagePopUp from "../ImagePopUp.js";
import { css } from "@emotion/react";
import MoonLoader from "react-spinners/MoonLoader";
import { CSSTransition } from "react-transition-group";
import PostVideo from "./PostVideo.js";


const axios = require("axios").default;
const io = require("socket.io-client");

let socket = io();
let updatedChats = [];

const Chatbox = function ({
  signedInUser,
  changeBackground,
  activeClicked,
  changeClicked,
}) {
  const [typedMessage, changeMessage] = useState("");
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

  const [chats, updateChats] = useState([]);
  const [loadedAll, changeLoadedAll] = useState(true);
  const [newChatsCount, changeNewChatsCount] = useState(0);

  const override = css`
    align-items: center;
    margin: auto auto;
  `;

  const inputRef = useRef(null);
  const chatBoxRef = useRef();
  const observer = useRef();
  const didMountRef = useRef(false);
  const lastLoadedChat = useRef(null);

  const firstChatRef = useCallback(
    (node) => {
      if (loading) {
        return;
      } else {
        if (observer.current) {
          observer.current.disconnect();
        }
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && !loadedAll && chats.length > 0) {
            console.log("node is intersecting");
            changeLoading(true);
            changeLoadedAll(true);
            socket.emit("getMoreChats", chats[0]._id);
          }
        });
        if (node) {
          observer.current.observe(node);
        }
      }
    },
    [loading, loadedAll, chats]
  );

  const onClickVideoModal = (e) => {
    e.stopPropagation();
    toggleVideoModal(!showVideoModal);
  };

  const closeAllModals = () => {
    toggleKeepVideoModal(false);
    toggleVideoModal(false);
    toggleGifModal(false);
  };

  const addEmoji = () => {
    toggleEmojiModal(true);
  };

  const hideEmoji = () => {
    toggleEmojiModal(false);
  };

  const toggleGif = (e) => {
    e.stopPropagation();
    toggleGifModal(!showGifModal);
  };

  const hideGif = () => {
    toggleGifModal(false);
  };

  const onEmojiClick = (event, emojiObject) => {
    const { selectionStart, selectionEnd } = inputRef.current;
    const newTypedMessage =
      typedMessage.slice(0, selectionStart) +
      emojiObject.emoji +
      typedMessage.slice(selectionEnd);
    changeMessage(newTypedMessage);
  };

  const onGifClick = (gif) => {
    if (signedInUser) {
      const username = signedInUser.username;
      const png = signedInUser.png;
      socket.emit("sendMessage", {
        username,
        gif: { downsized: gif.downsized.url, original: gif.original.url },
        png,
      });
    } else {
      changeResponse("Please sign in");
      const messageFlash = setTimeout(() => {
        changeResponse("");
      }, 2500);
    }
    toggleGifModal(false);
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
    if (signedInUser) {
      changePreviewImages([]);
      changeResponse("creating post");
      const username = signedInUser.username;
      const png = signedInUser.png;
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
          username,
          typedMessage,
          imageURLs,
          submittedVideo,
          png,
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

  const scrollToBottom = () => {
    const timeout1 = setTimeout(() => {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }, 500);
  };

  const scrollToLastLoadedChat = () => {
    const timeout1 = setTimeout(() => {
      lastLoadedChat.current.scrollIntoView({
        block: "center",
        inline: "nearest",
      });
    }, 1);
  };

  const imageClick = (image) => {
    changePopUpImage(image);
    toggleImagePopUp(true);
  };

  const convertedTimeStamp = (date) => {
    const timeStamp = getDateStamp(parseISOString(date));
    const timeStampArray = timeStamp.split(" ");
    timeStampArray[0] = timeStampArray[0].slice(0,timeStampArray[0].length - 1)
    const timeArray = timeStampArray[1].split(":");
    const time = timeArray[0] + ":" + timeArray[1];
    timeStampArray[1] = time;
    if (getDateStamp(new Date()).split(", ")[0] == timeStamp.split(", ")[0]) {
      return `Today, ${timeStampArray[1] + timeStampArray[2]}`;
    } else {
      console.log("CONVERTED TIMESTAMP ARRAY:", timeStampArray)
      return timeStampArray.join("  ");
    }
  };

  useEffect(() => {
    changeClicked("smackboard");
    changeBackground("./Backgrounds/season6.png");
    socket.on("allChats", (data) => {
      const reversedChats = data.result.slice().reverse();
      // changeLoadedAll(data.loadedAll);
      updateChats(reversedChats);
      const loadedAllTimeout = setTimeout(() => {
        changeLoadedAll(data.loadedAll);
      }, 2000);
      scrollToBottom();
      changeLoading(false);
    });
    socket.emit("getAllChats");
  }, []);

  useEffect(() => {
    socket.on("addOlderChats", (data) => {
      changeLoading(true);
      const reversedChats = data.result.slice().reverse();
      updatedChats = reversedChats.concat(chats);
      const loadedAllTimeout = setTimeout(() => {
        changeLoadedAll(data.loadedAll);
      }, 2000);
      changeNewChatsCount(data.result.length);
      updateChats(updatedChats);
      changeLoading(false);
      scrollToLastLoadedChat();
    });
  }, [chats]);

  return (
    <div className="mainComponent" onClick={closeAllModals}>
      <div id="smackboardComponent">
        <div className="headerWrapper">
          <h1 className="componentHeader">Smackboard</h1>
        </div>
        <div className="smackNewsMain smackMain">
          <CSSTransition
            in={activeClicked === "smackboard"}
            timeout={1000}
            classNames="smackboardAnimation"
            unmountOnExit
          >
            <div className="smackboardWrapper">
              {loading ? (
                <MoonLoader
                  color="#79d9ff"
                  loading={loading}
                  css={override}
                  size="100px"
                />
              ) : (
                <div id="chatbox" ref={chatBoxRef}>
                  {!loadedAll && (
                    <div
                      ref={firstChatRef}
                      className="galleryLoadMoreWrapper colorHover pointerHover"
                    >
                      <p className="galleryLoadMore">Load More</p>
                    </div>
                  )}
                  {chats.map((chat, index) => {
                    return (
                      <div
                        key={chat._id}
                        ref={index === newChatsCount ? lastLoadedChat : null}
                        id="chat"
                      >
                        <div className="nameDate">
                          <div className="chatAvatarWrapper">
                            <img
                              className="chatAvatarImage"
                              src={`https://mywarzoneappbucket.s3.us-west-1.amazonaws.com/${chat.png}_largeThumb.png`}
                            />
                          </div>
                          <div className="chatName">{chat.name}</div>
                          <div className="chatDate">
                            {convertedTimeStamp(chat.date)}
                          </div>
                        </div>
                        <div className="chatContent">
                          <div id="chatMessage">{chat.message}</div>
                          {chat.gif && (
                            <img
                              className="chatItem"
                              id="chatGif"
                              src={chat.gif.downsized}
                              onClick={() => imageClick(chat.gif.original)}
                            ></img>
                          )}
                          {chat.video && (
                            <div className="ytOutterWrapper">
                              <div id="ytPlayerWrapper" className="chatItem">
                                <iframe
                                  className="ytPlayer"
                                  id="galleryYTPlayer"
                                  type="text/html"
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
                <div className="smackButtonWrapper" onClick={(e) => onClickVideoModal(e)}>
                      <img
                        className="messageIcon"
                        src="./icons/videoIcon.png"
                      />
                  </div>
                  <div className="smackButtonWrapper" onClick={(e) => onClickVideoModal(e)}>
                      <img
                        className="messageIcon"
                        src="./icons/videoIcon.png"
                      />
                  </div>
                  <div className="smackButtonWrapper" onClick={(e) => toggleGif(e)}>
                      <img className="messageIcon" src="./icons/gifIcon.png" />
                    {showGifModal && (
                      <div id="gifPicker" onClick={(e) => e.stopPropagation()}>
                        <GifPicker id="emojiPicker" onSelected={onGifClick} />
                      </div>
                    )}
                  </div>
                  <div className="smackButtonWrapper" onMouseEnter={addEmoji}
                      onMouseLeave={hideEmoji}>
                      <img
                        className="messageIcon"
                        src="./icons/emojiIcon.png"
                      />
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
              {/* <DropzoneComponent
                changeQeuedImages={changeQeuedImages}
                previewImages={previewImages}
                changePreviewImages={changePreviewImages}
              /> */}
            </div>
          </CSSTransition>
          {/* <div className="bannerWrapper">
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
          </div> */}
        </div>

        <CSSTransition
          in={showImagePopUp}
          timeout={1000}
          classNames="addGalleryContentMod"
          unmountOnExit
        >
          <ImagePopUp
            popUpImage={popUpImage}
            popUpVideo={popUpVideo}
            showImagePopUp={showImagePopUp}
            toggleImagePopUp={toggleImagePopUp}
            changePopUpImage={changePopUpImage}
            changePopUpVideo={changePopUpVideo}
          />
        </CSSTransition>

        {showVideoModal && <PostVideo/>
          // <div id="videoSubmitDiv">
          //   <div id="videoInput">
          //     <p className="modalHeading">Post A Video</p>
          //     <form
          //       id="videoForm"
          //       onSubmit={(e) => {
          //         e.stopPropagation();
          //         handleVideoSubmit(e);
          //       }}
          //     >
          //       <input
          //         id="ytLinkInput"
          //         type="text"
          //         placeholder="Insert YouTube link..."
          //         value={typedVideoLink}
          //         onChange={(e) => handleChange(e, changeTypedVideoLink)}
          //         onClick={(e) => e.stopPropagation()}
          //       ></input>
          //       <div className="videoThumbWrapper">
          //         {typedVideoLink && handleVideoPreview(typedVideoLink)}
          //         {videoPreview ? (
          //           <img
          //             className="ytImagePreview"
          //             src={videoPreview.snippet.thumbnails.standard.url}
          //           ></img>
          //         ) : (
          //           <h3>No video selected</h3>
          //         )}
          //       </div>
          //       <input
          //         id="ytLinkInput"
          //         type="text"
          //         placeholder="Type your message here..."
          //         // value={typedVideoLink}
          //         // onChange={(e) => handleChange(e, changeTypedVideoLink)}
          //         onClick={(e) => e.stopPropagation()}
          //       ></input>
          //       <input
          //         id="videoSubmit"
          //         type="submit"
          //         value="submit"
          //         onClick={(e) => e.stopPropagation()}
          //       ></input>
          //     </form>
          //   </div>
          // </div>
        }
      </div>
    </div>
  );
};

export default Chatbox;
