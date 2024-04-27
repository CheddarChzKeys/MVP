import React, { useState, useContext } from "react";
import axios from "axios";
import DropzoneComponent from "./galleryDropbox.js";
import { ActiveUser } from "../../index.js";
import "animate.css";

const AddGalleryContent = ({ getGalleryContent, toggleAddContent }) => {
  const [imageField, changeImageField] = useState("");
  const [videoField, changeVideoField] = useState("");
  const [descriptionField, changeDescriptionField] = useState("");
  const [resultsMessage, changeResultsMessage] = useState("");

  const [qeuedImages, changeQeuedImages] = useState([]);
  const [previewImages, changePreviewImages] = useState([]);

  const signedInUser = useContext(ActiveUser);

  const addGalleryItem = (newItem) => {
    return axios.post("/gallery/add", newItem).then((results) => {
      const message = results.data.message;
      console.log("addItemMessage:", message);
      getGalleryContent();
      return message;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    changePreviewImages([]);
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

      let newVideoID;

      if (videoField) {
        const re =
          /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;

        newVideoID = re.exec(videoField)[1];
      }

      const newTimestamp = new Date().toLocaleString().split(",")[0];

      const user = signedInUser ? signedInUser.username : "Anonymous User";

      const newItemObject = {
        userName: user,
        uploadDate: newTimestamp,
        image: imageURL,
        video: newVideoID,
        description: descriptionField,
        png: signedInUser ? signedInUser.png : "Operator1",
      };

      addGalleryItem(newItemObject).then((message) => {
        changeResultsMessage(message);
        changeQeuedImages([]);
        toggleAddContent();
      });
    });
  };

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
                  onChange={(e) => {
                    if (qeuedImages.length === 0) {
                      changeImageField(e.target.value);
                      console.log("image field:", imageField);
                    }
                  }}
                />
              </div>
              <div className="inputWrapper">
                <h3 className="contentInputLabel">Video</h3>
                <input
                  className="addContentInput"
                  type="text"
                  placeholder="youtube url"
                  value={qeuedImages.length === 0 ? videoField : ""}
                  onChange={(e) => {
                    if (qeuedImages.length === 0) {
                      changeVideoField(e.target.value);
                    }
                  }}
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
