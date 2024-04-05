const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtKey = require("../../../hidden/jwt");

const findUsersDb = require("../../models/users/findUsersDb");
const refreshTokensDb = require("../../models/users/refreshTokensDb");

const createToken = (payload, expiresIn) => {
  return jwt.sign(payload, jwtKey.key, { expiresIn });
};

const logIn = async (req, res) => {
  const usernameAttempt = req.body.username.toLowerCase();
  const passwordAttempt = req.body.password;
  try {
    const foundUser = await findUsersDb(usernameAttempt);
    if (!foundUser) {
      throw new Error("Invalid username or password");
    }

    const passwordTest = await bcrypt.compare(
      passwordAttempt,
      foundUser.password
    );
    if (!passwordTest) {
      throw new Error("Invalid username or password");
    }

    const accessToken = createToken({ user: foundUser }, "30s");
    const refreshToken = createToken({ user: foundUser }, "1h");

    const refreshTokenResult = await refreshTokensDb.add(refreshToken);

    res.send({
      user: foundUser,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    res.send({ message: err.message });
  }
};

module.exports = logIn;
