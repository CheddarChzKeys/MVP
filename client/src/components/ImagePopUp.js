import React, { useEffect } from "react";

function ImagePopUp(props) {
  // useEffect(() => {
  //   var tag = document.createElement("script");
  //   tag.src = "https://www.youtube.com/iframe_api";
  //   console.log("tag:", tag);
  //   var firstScriptTag = document.getElementsByTagName("script")[0];
  //   console.log("firstScriptTag:", firstScriptTag);
  //   firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  //   function onPlayerReady(event) {
  //     event.target.playVideo();
  //   }

  //   var done = false;
  //   function onPlayerStateChange(event) {
  //     if (event.data == YT.PlayerState.PLAYING && !done) {
  //       setTimeout(stopVideo, 100000);
  //       done = true;
  //     }
  //   }
  //   function stopVideo() {
  //     player.stopVideo();
  //   }
  //   console.log("TrYING to LOAD PLAYER");
  //   var player;

  //   function onYouTubeIframeAPIReady() {
  //     console.log("youTube Iframe API REady");
  //     player = new YT.Player("player", {
  //       height: "390",
  //       width: "640",
  //       videoId: "Y19q-7VN2WI",
  //       playerVars: {
  //         playsinline: 1,
  //       },
  //       events: {
  //         onReady: onPlayerReady,
  //         onStateChange: onPlayerStateChange,
  //       },
  //     });
  //   }
  // });
  const onClose = () => {
    props.toggleImagePopUp(false);
    props.changePopUpImage(null);
    props.changePopUpVideo(null);
  };

  return (
    <div className="addBackdrop" onClick={onClose}>
      <div className="popUp">
        <div className="fullImageWrapper" onClick={(e) => e.stopPropagation()}>
          <div
            className={
              props.popUpImage ? "inner fullImageInner" : "inner fullVideoInner"
            }
          >
            <div className="buttonWrapper">
              <button
                className="closeButton pointerHover"
                onClick={() => onClose()}
              >
                X
              </button>
            </div>
            {props.popUpImage && (
              <img className="fullImage" src={props.popUpImage} />
            )}
            {props.popUpVideo && (
              <iframe
                className="ytPlayer"
                id="popUpYTPlayer"
                type="text/html" // width="400"
                // height="243"
                src={`http://www.youtube.com/embed/${props.popUpVideo}`}
                frameBorder="0"
                allowFullScreen="allowfullscreen"
                mozallowfullscreen="mozallowfullscreen"
                msallowfullscreen="msallowfullscreen"
                oallowfullscreen="oallowfullscreen"
                webkitallowfullscreen="webkitallowfullscreen"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImagePopUp;
