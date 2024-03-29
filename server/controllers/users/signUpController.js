const bcrypt = require("bcrypt");
const dbClient = require("../../dbaccess");

const signUp = async (req, res) => {
  const db = dbClient.db("warzone");
  const users = db.collection("users");
  const username = req.body.username;
  const usernameLowerCase = req.body.username.toLowerCase();
  const password = req.body.password;
  const gamerTag = req.body.gamerTag;
  const platform = req.body.platform;
  const hashedPassword = await bcrypt.hash(password, 10);
  const png = req.body.png;
  users.findOne({ usernameLowerCase: usernameLowerCase }, async (err, data) => {
    if (data) {
      res.send("Username taken");
    } else {
      await users.insertOne({
        username,
        usernameLowerCase,
        password: hashedPassword,
        gamerTag,
        platform,
        png,
      });
      res.send("New soldier enlisted");
    }
  });
};

module.exports = signUp;
