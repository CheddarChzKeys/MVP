import React,{useEffect} from "react";

const qeuedImagesPreview = ({qeuedImages, removeImageIndex, cleanUpQeuedPreviews})=>{

useEffect(()=>
    cleanUpQeuedPreviews
    ,[])

return(
  <div id="qeuedImagesPreview">
    {qeuedImages.map((image, index)=> 
    <div className="qeuedImagesWrapper">
      <img className= "qeuedImage" src={image.qeuePreview}></img>
      <div className = "previewRemove pointerHover blueHover" onClick = {() => removeImageIndex(index)}>
        <span>X</span>
      </div>
    </div>
    )}
  </div>
)
}

export default qeuedImagesPreview;