import React, {
  useState,
  useEffect,
  useRef,
} from "react";
import Chatbox from "./Chatbox";
import Picker from "emoji-picker-react";
import GifPicker from "react-giphy-picker";
import ImagePopUp from "../ImagePopUp.js";
import { CSSTransition } from "react-transition-group";
import PostVideo from "./PostVideo.js";
import PostImages from "./PostImages";
import QeuedImagesPreview from "./QeuedImagesPreview.js";

const axios = require("axios").default;
const io = require("socket.io-client");

let socket = io();

const Chat = function ({
  signedInUser,
  changeBackground,
  activeClicked,
  changeClicked,
}) {
  const [typedMessage, changeMessage] = useState("");
  const [showVideoModal, toggleVideoModal] = useState(false);
  const [showEmojiModal, toggleEmojiModal] = useState(false);
  const [showGifModal, toggleGifModal] = useState(false);
  const [showImagesModal, toggleImagesModal] = useState(false);
  const [submitResponse, changeResponse] = useState("");
  const [submittedVideo, changeSubmittedVideo] = useState(null);
  const [qeuedGif, changeQeuedGif] = useState(null);
  const [qeuedImages, changeQeuedImages] = useState([]);
  const [popUpImage, changePopUpImage] = useState(null);
  const [showImagePopUp, toggleImagePopUp] = useState(false);
  const [loading, changeLoading] = useState(true);

  const inputRef = useRef(null);

  const onClickVideoModal = (e) => {
    e.stopPropagation();
    toggleVideoModal(!showVideoModal);
  };

  const onClickImagesModal = (e) => {
    e.stopPropagation();
    toggleImagesModal(!showImagesModal);
  }

  const closeAllModals = () => {
    toggleVideoModal(false);
    toggleImagesModal(false);
    toggleGifModal(false);
    toggleEmojiModal(false);
  };

  const toggleGif = (e) => {
    e.stopPropagation();
    toggleGifModal(!showGifModal);
    if (showEmojiModal) {
      toggleEmojiModal(false);
    }
  };

  const toggleEmoji = (e) => {
    e.stopPropagation();
    toggleEmojiModal(!showEmojiModal);
    if (showGifModal) {
      toggleGifModal(false);
    }
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
    changeQeuedGif(gif);
    changeQeuedImages([]);
    changeSubmittedVideo(null);
    toggleGifModal(false);
  };

  const handleChange = (e, field) => {
    field(e.target.value);
  };

  const cleanUpQeuedPreviews = () => {
    qeuedImages.map((image)=> {
      console.log("CLEANUP");
      URL.revokeObjectURL(image.qeuePreview)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (signedInUser) {
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
          gif: qeuedGif ? { downsized: qeuedGif.downsized.url, original: qeuedGif.original.url } : null,
          png,
        });
        changeMessage("");
        changeQeuedImages([]);
        changeQeuedGif(null);
        changeSubmittedVideo(null);
        changeResponse("post complete");
        setTimeout(() => {
          changeResponse("");
          console.log("SET TIMEOUT")
        }, 2500);
      });
    } else {
      changeResponse("Please sign in");
      setTimeout(() => {
        changeResponse("");
        console.log("SET TIMEOUT")
      }, 2500);
    }
  };
  
  const removeImageIndex = (index) => {
    console.log("SPLICE INDEX: ", index);
    console.log("QEUEDIMAGES: ", qeuedImages);
    URL.revokeObjectURL(qeuedImages[index].qeuePreview);
    console.log("CLEANUP");
    changeQeuedImages(qeuedImages.slice(0, index).concat(qeuedImages.slice(index+1)));
    console.log("QEUEDIMAGES2: ", qeuedImages);
  };

  useEffect(() => {
    changeClicked("smackboard");
    changeBackground("./Backgrounds/season6.png");
    socket.emit("getAllChats");
  }, []);

  return (
    <div className="mainComponent" onClick={closeAllModals}>
      <div id="smackboardComponent">
        <div className="headerWrapper">
          <h1 className="componentHeader">Smackboard</h1>
        </div>
          <CSSTransition
            in={activeClicked === "smackboard"}
            timeout={1000}
            classNames="smackboardAnimation"
            unmountOnExit
          >
            <div className="smackboardWrapper">
                <Chatbox loading={loading} changeLoading={changeLoading} changePopUpImage={changePopUpImage} socket={socket} toggleImagePopUp={toggleImagePopUp}/>
              <div id="chatResponse">{submitResponse}
                {showGifModal && !submittedVideo && !qeuedImages &&(
                  <div id="gifPicker" onClick={(e) => e.stopPropagation()}>
                    <GifPicker id="emojiPicker" onSelected={onGifClick} />
                  </div>
                )}
                {showEmojiModal && !submittedVideo && !qeuedImages && (
                  <div
                    id="pickerDiv" onClick={(e) => e.stopPropagation()}
                  >
                    <Picker id="emojiPicker" onEmojiClick={onEmojiClick} />
                  </div>
                )}
              </div>
              <div id="messageSubmit">
              <div id="attachmentPreview">
                {submittedVideo && 
                  <div id = "attachmentVideoPreview">
                    <iframe
                    className="ytPlayer"
                    id="previewYTPlayer"
                    type="text/html"
                    src={`http://www.youtube.com/embed/${submittedVideo}`}
                    frameBorder="0"
                    allowFullScreen="allowfullscreen"
                    mozallowfullscreen="mozallowfullscreen"
                    msallowfullscreen="msallowfullscreen"
                    oallowfullscreen="oallowfullscreen"
                    webkitallowfullscreen="webkitallowfullscreen"
                  />
                    <div className = "previewRemove pointerHover blueHover" onClick = {() => changeSubmittedVideo(null)}>
                      <span>X</span>
                    </div>
                  </div>
                }
                {qeuedImages.length > 0 &&
                  <QeuedImagesPreview qeuedImages={qeuedImages} removeImageIndex={removeImageIndex} cleanUpQeuedPreviews={cleanUpQeuedPreviews}/>
                }
                {qeuedGif && 
                  <div id="qeuedImagesPreview">
                    <div className="qeuedImagesWrapper">
                      <img className= "qeuedImage" src={qeuedGif.downsized.url}></img>
                      <div className = "previewRemove pointerHover blueHover" onClick = {() => changeQeuedGif(null)}>
                        <span>X</span>
                      </div>
                    </div>
                  </div>
                }
                {showGifModal && (
                  <div id="gifPicker" onClick={(e) => e.stopPropagation()}>
                    <GifPicker id="emojiPicker" onSelected={onGifClick} />
                  </div>
                )}
                {showEmojiModal && (
                  <div
                    id="pickerDiv" onClick={(e) => e.stopPropagation()}
                  >
                    <Picker id="emojiPicker" onEmojiClick={onEmojiClick} />
                  </div>
                )}
                </div>
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
                <div className="buttonsWrapper">
                <div className="smackButtonWrapper" 
                      onClick={(e)=> toggleEmoji(e)}>
                      <img
                        className="messageIcon"
                        src="./icons/emojiIcon.png"
                      />
                  </div>
                  <div className="smackButtonWrapper" onClick={(e) => toggleGif(e)}>
                      <img className="messageIcon" src="./icons/gifIcon.png" />
                  </div>
                <div className="smackButtonWrapper" onClick={(e) => onClickVideoModal(e)}>
                      <img
                        className="messageIcon"
                        src="./icons/videoIcon.png"
                      />
                  </div>
                  <div className="smackButtonWrapper" onClick={(e) => onClickImagesModal(e)}>
                      <img
                        className="messageIcon"
                        src="./icons/videoIcon.png"
                      />
                  </div>
                </div>
                </div>
              </div>
              {showVideoModal && <PostVideo changeSubmittedVideo={changeSubmittedVideo} toggleVideoModal={toggleVideoModal} changeQeuedImages={changeQeuedImages} changeQeuedGif={changeQeuedGif}/>}
              {showImagesModal && <PostImages changeQeuedImages={changeQeuedImages} toggleImagesModal={toggleImagesModal} changeSubmittedVideo={changeSubmittedVideo} changeQeuedGif={changeQeuedGif} cleanUpQeuedPreviews={cleanUpQeuedPreviews}/>}
              {showImagePopUp && <ImagePopUp popUpImage={popUpImage} changePopUpImage={changePopUpImage} toggleImagePopUp={toggleImagePopUp}/>}
            </div>
          </CSSTransition>
      </div>
    </div>
  )
};

export default Chat;
