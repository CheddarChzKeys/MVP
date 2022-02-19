import React, { useState } from "react";
const axios = require("axios").default;

const SignUp = ({ toggleSignUp }) => {
  const [typedUsername, changeUsername] = useState("");
  const [typedPassword, changePassword] = useState("");
  const [typedPassword2, changePassword2] = useState("");
  const [gamerTag, changeGamerTag] = useState("");
  const [checkedPlatform, changePlatform] = useState(null);
  const [isVerified, changeVerified] = useState(false);
  const [usernameRes, changeUsernameRes] = useState("");
  const [pwResponse, changePwResponse] = useState("");
  const [verifyResponse, changeVerifiedResponse] = useState("");
  const [signUpResponse, changeSignUpResponse] = useState("");
  const [isSignedUp, toggleIsSignedUp] = useState(false);

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
      changeVerifiedResponse("Verification failed");
    }
    e.preventDefault(true);
  };

  const handleChecked = (platform) => {
    checkedPlatform == platform
      ? changePlatform(null)
      : changePlatform(platform);
  };

  const handleSignUp = (e) => {
    if (typedPassword !== typedPassword2 || typedPassword.length < 1) {
      changePwResponse("Passwords do not match");
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
        results.data == "Username already taken"
          ? changeUsernameRes(results.data)
          : changeVerifiedResponse(results.data);
        toggleIsSignedUp(true);
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
        <div>
          <input
            className="textInput"
            id="username"
            placeholder="username"
            type="text"
            onChange={(e) => {
              handleChange(e, changeUsername);
              changeUsernameRes("");
            }}
          ></input>
          <div className="loginResponse">{usernameRes}, &nbsp;</div>
        </div>

        <div>
          <input
            className="textInput"
            id="password"
            placeholder="password"
            type="password"
            value={typedPassword}
            onChange={(e) => {
              handleChange(e, changePassword);
              changePwResponse("");
            }}
          ></input>
          <div className="loginResponse">&nbsp;</div>
        </div>
        <div>
          <input
            className="textInput"
            id="password2"
            placeholder="confirm password"
            type="password"
            value={typedPassword2}
            onChange={(e) => {
              handleChange(e, changePassword2);
              changePwResponse("");
            }}
          ></input>
          <div className="signUpResponse">{pwResponse}, &nbsp;</div>
        </div>
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
        <div>
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
          <div className="signUpResponse">{verifyResponse}, &nbsp;</div>
        </div>
        <div>
          {isVerified ? (
            isSignedUp ? (
              <h3 className="blueHover" onClick={() => toggleSignUp()}>
                Sign In
              </h3>
            ) : (
              <input
                className="blueHover"
                id="submit"
                type="submit"
                value="submit"
                onClick={(e) => handleSignUp(e)}
              ></input>
            )
          ) : (
            <input
              className="blueHover"
              id="verify"
              type="button"
              value="Verify"
              onClick={(e) => handleVerify(e, gamerTag, checkedPlatform)}
              s
            ></input>
          )}
          <div className="signUpResponse">{signUpResponse}, &nbsp;</div>
          {/* <input
            className="blueHover"
            id="submit"
            type="submit"
            onClick={(e) => handleSignUp(e)}
          ></input> */}
        </div>
      </form>
    </div>
  );
};

export default SignUp;
