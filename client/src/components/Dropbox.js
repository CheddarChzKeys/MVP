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
  margin: "1em 0",
  borderColor: "#79d9ff",
  borderStyle: "solid",
  backgroundColor: "rgba(70, 69, 69, 0.445)",
  color: "#bdbdbd",
  transition: "border .3s ease-in-out",
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
    props.changePreviewImages(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
    console.log(acceptedFiles);
    props.changeQeuedImages(acceptedFiles);
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
    <div key={file.name} id="previewDiv">
      <img id="previewImage" src={file.preview} alt={file.name} />
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
      <div {...getRootProps({ style })}>
        <div id="previewThumbs">{thumbs}</div>
        <input {...getInputProps()} />
        <div>drop images here.</div>
      </div>
    </div>
  );
}

export default DropzoneComponent;
