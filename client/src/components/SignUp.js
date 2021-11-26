import React, { useState } from "react";
const axios = require("axios").default;

const SignUp = () => {
  const [typedUsername, changeUsername] = useState("");
  const [typedPassword, changePassword] = useState("");
  const [typedPassword2, changePassword2] = useState("");
  // const [passwordMatch, togglePasswordMatch] = useState(false);
  const [gamerTag, changeGamerTag] = useState("");
  const [checkedPlatform, changePlatform] = useState(null);
  const [isVerified, changeVerified] = useState(false);
  const [verifyResponse, changeVerifiedResponse] = useState(" ");
  const [signUpResponse, changeSignUpResponse] = useState("");

  const handleVerify = async (e, gamerTag, checkedPlatform) => {
    const verifyObject = {
      gamerTag: gamerTag,
      platform: checkedPlatform,
    };
    console.log("verifyObject:", verifyObject);
    const results = await axios.post("/verify", verifyObject);
    if (results.data) {
      changeVerified(true);
      changeVerifiedResponse("Gamer Tag verified");
      console.log("result is: ", results);
      console.log("isVerified =", isVerified);
    } else {
      changeVerified(false);
      changeVerifiedResponse("Verification unsuccessful");
    }
    e.preventDefault();
  };

  const handleChecked = (platform) => {
    checkedPlatform == platform
      ? changePlatform(null)
      : changePlatform(platform);
  };

  const handleSignUp = (e) => {
    if (typedPassword !== typedPassword2 || typedPassword.length < 1) {
      changeSignUpResponse("Passwords do not match");
    } else if (!isVerified) {
      changeSignUpResponse("Please verify Gamer Tag");
    } else {
      const loginObject = {
        username: typedUsername,
        password: typedPassword,
        gamerTag: gamerTag,
        platform: checkedPlatform,
      };
      axios.post("/signUp", loginObject).then((results) => {
        changeSignUpResponse(results.data);
      });
      //   console.log(results);
      //   if (results.data.user) {
      //     changeSignedInUser(results.data.user.username);
      //     toggleSignedIn(true);
      //   }
      // });
    }
    changePassword("");
    changePassword2("");
    e.preventDefault();
  };

  const handleChange = (e, change) => {
    change(e.target.value);
  };

  return (
    <div id="loginDiv">
      <h2>Enlist for Service</h2>
      <form onSubmit={(e) => handleLogin(e)}>
        <input
          className="textInput"
          id="username"
          placeholder="username"
          type="text"
          onChange={(e) => handleChange(e, changeUsername)}
        ></input>

        <input
          className="textInput"
          id="password"
          placeholder="password"
          type="password"
          value={typedPassword}
          onChange={(e) => handleChange(e, changePassword)}
        ></input>
        <input
          className="textInput"
          id="password2"
          placeholder="confirm password"
          type="password"
          value={typedPassword2}
          onChange={(e) => handleChange(e, changePassword2)}
        ></input>
        <input
          className="textInput"
          id="gamerTag"
          placeholder="gamer tag"
          type="text"
          value={gamerTag}
          onChange={(e) => {
            handleChange(e, changeGamerTag);
            changeVerified(false);
            changeVerifiedResponse("");
          }}
        ></input>
        <div id="platformDiv">
          <input
            className="textInput"
            id="psnCheck"
            placeholder="Gamer Tag"
            type="checkbox"
            name="psn"
            checked={checkedPlatform == "psn" ? true : false}
            onChange={() => handleChecked("psn")}
            value="psn"
            // onChange={(e) => handleChange(e, changePassword)}
          ></input>
          <div className="checkboxLabel">
            <p>PSN</p>
          </div>

          <input
            className="textInput"
            id="xblCheck"
            type="checkbox"
            name="xbl"
            checked={checkedPlatform == "xbl" ? true : false}
            onChange={() => handleChecked("xbl")}
            value="xbl"
            // onChange={(e) => handleChange(e, changePassword)}
          ></input>
          <div className="checkboxLabel">
            <p>XBL</p>
          </div>

          <input
            className="textInput"
            id="actiCheck"
            type="checkbox"
            name="acti"
            checked={checkedPlatform == "acti" ? true : false}
            onChange={() => handleChecked("acti")}
            value="acti"
            // onChange={(e) => handleChange(e, changePassword)}
          ></input>
          <div className="checkboxLabel">
            <p>ACTI</p>
          </div>
        </div>
        <div id="loginResponse">{verifyResponse}</div>
        <input
          className="blueHover"
          id="verify"
          type="button"
          value="Verify"
          onClick={(e) => handleVerify(e, gamerTag, checkedPlatform)}
        ></input>
        <div id="loginResponse">{signUpResponse}</div>
        <input
          className="blueHover"
          id="submit"
          type="submit"
          onClick={(e) => handleSignUp(e)}
        ></input>
      </form>
    </div>
  );
};

export default SignUp;
