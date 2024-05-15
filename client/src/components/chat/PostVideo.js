import React, {useState} from "react";
import ytAPIKey from "../../../../hidden/youtubeAPIv3.js";
import axios from "axios";

const postVideo = ({changeSubmittedVideo,toggleVideoModal, changeQeuedImages, changeQeuedGif}) => {
    const [typedVideoLink, changeTypedVideoLink] = useState("");
    const [videoPreview, changeVideoPreview] = useState(null);

    const handleVideoSubmit = (e) => {
        e.preventDefault();
        let videoID = typedVideoLink;
        const re =
            /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;

        const newVideoID = re.exec(videoID);

        changeSubmittedVideo(newVideoID[1]);
        changeQeuedImages([]);
        changeQeuedGif(null);
        toggleVideoModal(false);
    };

    const handleVideoPreview = (videoLink) => {
        let videoID = videoLink;
        const re =
          /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
    
        const newVideoID = re.exec(videoID);
    
        axios
          .get(
            `https://www.googleapis.com/youtube/v3/videos?id=${newVideoID}&key=${ytAPIKey}&part=snippet,statistics`
          )
          .then((result) => {
            console.log("YOUTUBE RESULT", result.data.items[0]);
            changeVideoPreview(result.data.items[0].id);
          });
        return;
      };

      const handleChange = (e, field) => {
        field(e.target.value);
      };

    return(
        <div id="videoSubmitDiv" >
            <div id="videoInput" onClick={(e) => e.stopPropagation()}>
            <p className="modalHeading">Post A Video</p>
            <form id="videoForm" onSubmit={(e) => {
                e.stopPropagation();
                handleVideoSubmit(e);
                }}
            >
                <input
                id="ytLinkInput"
                type="text"
                placeholder="Insert YouTube link..."
                value={typedVideoLink}
                onChange={(e) => handleChange(e, changeTypedVideoLink)}
                />
                <div className="videoThumbWrapper">
                {typedVideoLink && handleVideoPreview(typedVideoLink)}
                    {videoPreview ? (
                        <iframe
                        className="ytPlayer"
                        id="chatPostPreviewYTPlayer"
                        type="text/html"
                        src={`http://www.youtube.com/embed/${videoPreview}`}
                        frameBorder="0"
                        allowFullScreen="allowfullscreen"
                        mozallowfullscreen="mozallowfullscreen"
                        msallowfullscreen="msallowfullscreen"
                        oallowfullscreen="oallowfullscreen"
                        webkitallowfullscreen="webkitallowfullscreen"
                      ></iframe>
                    ) : (
                    <p>No video selected</p>
                    )}
                </div>
                <input
                id="videoSubmit" type="submit" value="submit" onClick={(e) => e.stopPropagation()}
                />
            </form>
            </div>
        </div>  
    )
}

export default postVideo;