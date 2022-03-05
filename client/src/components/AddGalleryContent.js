import React, { useState } from "react";
import axios from "axios";
import DropzoneComponent from "./galleryDropbox.js";

const AddGalleryContent = ({ fetchGalleryContent, toggleAddContent }) => {
  const [imageField, changeImageField] = useState("");
  const [videoField, changeVideoField] = useState("");
  const [descriptionField, changeDescriptionField] = useState("");
  const [resultsMessage, changeResultsMessage] = useState("");

  const [qeuedImages, changeQeuedImages] = useState([]);
  const [previewImages, changePreviewImages] = useState([]);

  const addGalleryItem = (newItem) => {
    return axios.post("/newGalleryContent", newItem).then((results) => {
      fetchGalleryContent();
      const resultsMessage = results.data.message;
      console.log("addItemMessage:", resultsMessage);
      return resultsMessage;
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const newItemObject = {
  //     user: "JRICKROSS",
  //     uploadDate: "2/26/2022",
  //     image: imageField,
  //     video: videoField,
  //   };

  //   addGalleryItem(newItemObject).then((message) =>
  //     changeResultsMessage(message)
  //   );
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (userName) {
    changePreviewImages([]);
    // changeResponse("creating post");
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
      let imageURL;
      if (imageURLs.length > 0) {
        imageURL = imageURLs[0];
      }

      let uploadedVideo;
      if (videoField) {
        uploadedVideo = videoField.split("=")[1];
      }

      const newItemObject = {
        userName: "JRICKROSS",
        uploadDate: "2/27/2022",
        image: imageURL,
        video: uploadedVideo,
        description: descriptionField,
      };

      addGalleryItem(newItemObject).then((message) =>
        changeResultsMessage(message)
      );
      changeQeuedImages([]);
      // changeResponse("post complete");
      // const messageFlash = setTimeout(() => {
      //   changeResponse("");
      // }, 2500);
    });
    // } else {
    //   changeResponse("Please sign in to chat");
    //   const messageFlash = setTimeout(() => {
    //     changeResponse("");
    //   }, 2500);
    // }
  };

  // const handleOnChange = (e, changeFunction) {
  //   changeFunction(e.target.value)
  // };

  return (
    <div className="addBackdrop" onClick={toggleAddContent}>
      <div className="addGalleryContent" onClick={(e) => e.stopPropagation()}>
        <h1>Add Content</h1>
        <div className="addContentMain">
          <div id="addContentFormWrapper">
            <div className="galleryDropzoneWrapper">
              <DropzoneComponent
                changeQeuedImages={changeQeuedImages}
                previewImages={previewImages}
                changePreviewImages={changePreviewImages}
              />
            </div>
            <form className="addContentForm" onSubmit={(e) => handleSubmit(e)}>
              <div className="inputWrapper">
                <h3 className="contentInputLabel">Image</h3>
                <input
                  className="addContentInput"
                  type="text"
                  placeholder="image url or upload image"
                  value={qeuedImages.length === 0 ? imageField : ""}
                  onChange={(e) => changeImageField(e.target.value)}
                />
              </div>
              <div className="inputWrapper">
                <h3 className="contentInputLabel">Video</h3>
                <input
                  className="addContentInput"
                  type="text"
                  placeholder="youtube url"
                  value={qeuedImages.length === 0 ? videoField : ""}
                  onChange={(e) => changeVideoField(e.target.value)}
                />
              </div>
              <div className="inputWrapper">
                <h3 className="contentInputLabel">Description</h3>
                <textarea
                  rows="4"
                  className="addContentInput"
                  id="descriptionField"
                  type="text"
                  value={descriptionField}
                  onChange={(e) => changeDescriptionField(e.target.value)}
                />
              </div>
              <input
                className="addContentInput generalHover"
                id="galleryContentSubmit"
                type="submit"
                value="Add to gallery"
              />
              <h3>{resultsMessage}</h3>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGalleryContent;