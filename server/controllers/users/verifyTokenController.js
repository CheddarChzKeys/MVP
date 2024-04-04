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
  const accessToken = req.body.accessToken;
  const decodedAccessToken = verify(accessToken);
  if (decodedAccessToken) {
    return res.status(200).json(decodedAccessToken);
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
            {
              expiresIn: "30s",
            }
          );
          return res.status(200).send({
            user: decodedRefreshToken.user,
            newAccessToken: newAccessToken,
          });
        } else {
          await refreshTokensDb.delete(foundRefreshToken.refreshToken);
          return res.status(401);
        }
      }
    } else {
      return res.status(200).send("Refresh token expired");
    }
  }
};

module.exports = verifyToken;
