const jwt = require("jsonwebtoken");
const jwtkey = require("../../../hidden/jwt");
const refreshTokensDb = require("../../models/users/refreshTokensDb.js");

const verify = (token) => {
  return jwt.verify(token, jwtkey.key, (err, decoded) => {
    if (decoded) {
      return decoded;
    }
    return;
  });
};

const verifyToken = async (req, res) => {
  try {
    const accessToken = req.body.accessToken;
    const decodedAccessToken = verify(accessToken);
    if (decodedAccessToken) {
      res.send(decodedAccessToken);
    } else {
      const refreshToken = req.body.refreshToken;
      if (refreshToken) {
        const foundRefreshToken = await refreshTokensDb.find(refreshToken);
        if (foundRefreshToken) {
          decodedRefreshToken = verify(foundRefreshToken.refreshToken);
          if (decodedRefreshToken) {
            const newAccessToken = jwt.sign(
              { user: decodedRefreshToken.user },
              jwtkey.key,
              { expiresIn: "30s" }
            );
            res.send({
              user: decodedRefreshToken.user,
              newAccessToken: newAccessToken,
            });
          } else {
            const deleteResult = await refreshTokensDb.delete(
              foundRefreshToken.refreshToken
            );
            res.status(401);
          }
        } else {
          res.status(401);
        }
      } else {
        res.status(401);
      }
    }
  } catch (err) {
    console.log(`Error: ${err}`);
    res.status(401);
  }
};

module.exports = verifyToken;
