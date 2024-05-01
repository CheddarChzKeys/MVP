import React from "react";

const Enlisted = ({handleBack}) => {
  return(
    <div id="signUpDiv">
        <p className="logInButtons">New soldier enlisted</p>
        <p className="enlistedResponse">Please</p>
            <a className="enlistedResponse blueText pointerHover noWrap" onClick={handleBack}>
                sign in
            </a>
        <p className="enlistedResponse">to deploy into the warzone!</p>
    </div>
  )
}

export default Enlisted;