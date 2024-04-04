const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const findUsersDb = require("../../models/users/findUsersDb");
const refreshTokensDb = require("../../models/users/refreshTokensDb");
const jwtKey = require("../../../hidden/jwt");

const logIn = async (req, res) => {
  const usernameAttempt = req.body.username.toLowerCase();
  const passwordAttempt = req.body.password;
  const refreshTokens = db.collection("refreshTokens");
  const foundUser = await findUsersDb(usernameAttempt);

  if (!foundUser) {
    res.status(200).send({ message: "Invalid username" });
  } else {
    bcrypt.compare(passwordAttempt, foundUser.password, async (err, result) => {
      if (result === false) {
        res.status(200).send({ message: "Invalid password" });
      } else {
        //create jwt and send to client
        const accessToken = jwt.sign({ user: foundUser }, jwtKey.key, {
          expiresIn: "30s",
        });
        const refreshToken = jwt.sign(
          {
            user: foundUser,
          },
          jwtKey.key,
          { expiresIn: "1h" }
        );
        const refreshTokenResult = await refreshTokensDb.add(refreshToken);
        if (refreshTokenResult.acknowledged) {
          res.status(200).send({
            user: foundUser,
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
        } else {
          res.status(200).send({ message: "Refresh token error" });
        }
      }
    });
  }
};

module.exports = logIn;
