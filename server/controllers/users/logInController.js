const dbClient = require("../../dbAccess");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const logIn = async (req, res) => {
  const usernameAttempt = req.body.username.toLowerCase();
  const passwordAttempt = req.body.password;
  const db = dbClient.db("warzone");
  const users = db.collection("users");
  const refreshTokens = db.collection("refreshTokens");
  const foundUser = await users.findOne({
    usernameLowerCase: usernameAttempt,
  });
  if (!foundUser) {
    res.status(200).json({ message: "Invalid username" });
  } else {
    bcrypt.compare(passwordAttempt, foundUser.password, function (err, result) {
      if (result == false) {
        res.json({ message: "Invalid password" });
      } else {
        //create jwt and send to client
        const accessToken = jwt.sign({ user: foundUser }, "secret", {
          expiresIn: "30s",
        });
        const refreshToken = jwt.sign(
          {
            user: foundUser,
          },
          "secret",
          { expiresIn: "1h" }
        );
        refreshTokens.insertOne({
          refreshToken,
        });
        console.log("FOUND USER: ", foundUser);
        res.json({
          user: foundUser,
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      }
    });
  }
};

module.exports = logIn;
