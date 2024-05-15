import React, {useState} from "react";
import DropzoneComponent from "./SmackDropbox.js";

const postImages = ({changeQeuedImages, toggleImagesModal, changeSubmittedVideo, changeQeuedGif}) => {
    const [previewImages, changePreviewImages] = useState([]);

    const qeueImages = (e) =>{
      e.stopPropagation();
      changeQeuedImages(previewImages);
      changeSubmittedVideo(null);
      changeQeuedGif(null);
      toggleImagesModal(false);
    };

    return(
        <div id="videoSubmitDiv" >
            <div id="videoInput" onClick={(e) => e.stopPropagation()}>
                <p className="modalHeading">Add images</p>
                <DropzoneComponent
                previewImages={previewImages}
                changePreviewImages={changePreviewImages}
                />
                <div id="imageSubmit" onClick={(e) => qeueImages(e)}>
                  <span>Submit</span>
                </div>
            </div>
        </div>  
    )
}

export default postImages;