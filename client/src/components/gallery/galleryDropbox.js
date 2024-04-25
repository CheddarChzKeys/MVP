import React, { useCallback, useMemo, useEffect, useState } from "react";
const axios = require("axios").default;
import { useDropzone } from "react-dropzone";

const baseStyle = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  margin: "0",
  borderStyle: "solid",
  backgroundColor: "rgba(70, 69, 69, 0.445)",
  // color: "#bdbdbd",
  // transition: "border .3s ease-in-out",

  fontFamily: "modernWarfare",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

function DropzoneComponent(props) {
  const onDrop = useCallback((acceptedFiles) => {
    props.changePreviewImages([
      Object.assign(acceptedFiles[0], {
        preview: URL.createObjectURL(acceptedFiles[0]),
      }),
    ]);
    console.log(acceptedFiles[0]);
    props.changeQeuedImages([acceptedFiles[0]]);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png",
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const thumbs = props.previewImages.map((file) => (
    <div key={file.name} id="galleryPreviewDiv">
      <img id="galleryPreviewImage" src={file.preview} alt={file.name} />
    </div>
  ));

  // clean up
  useEffect(
    () => () => {
      props.previewImages.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [props.previewImages]
  );

  return (
    <div>
      <div
        id="galleryDropzone"
        className="dropzone"
        {...getRootProps({ style })}
      >
        <div id="galleryPreviewThumbs">{thumbs}</div>
        <input {...getInputProps()} />
        {props.previewImages.length === 0 && <div>upload image</div>}
      </div>
    </div>
  );
}

export default DropzoneComponent;
