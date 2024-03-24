const dbClient = require("../dbAccess");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res) => {
  const accessToken = req.body.accessToken;
  const db = dbClient.db("warzone");
  console.log("VERIFYING TOKENS");
  jwt.verify(accessToken, "secret", async (err, decoded) => {
    if (err) {
      const refreshToken = req.body.refreshToken;
      if (refreshToken) {
        console.log("FOUND LOCAL REFRESH TOKEN");
        const refreshTokens = db.collection("refreshTokens");
        const foundRefreshToken = await refreshTokens.findOne({
          refreshToken: refreshToken,
        });
        if (foundRefreshToken) {
          console.log("FOUND DB REFRESH TOKEN");
          jwt.verify(
            foundRefreshToken.refreshToken,
            "secret",
            async (err, decoded) => {
              if (err) {
                await refreshTokens.deleteOne({
                  refreshToken: foundRefreshToken.refreshToken,
                });
                return res.status(401).send(err);
              } else {
                console.log("REFRESH DECODED: ", decoded);
                const newAccessToken = jwt.sign(decoded.user, "secret", {
                  expiresIn: "30s",
                });
                return res
                  .status(200)
                  .json({ user: decoded, newAccessToken: newAccessToken });
              }
            }
          );
        }
      } else {
        return res.status(401).send(err);
      }
    } else {
      console.log("DECODED: ", decoded);
      return res.status(200).json({ user: decoded });
    }
  });
};

module.exports = verifyToken;
