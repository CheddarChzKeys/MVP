const bcrypt = require("bcrypt");
const dbClient = require("../../dbAccess");

const findUsersDb = require("../../models/users/findUsersDb");
const createUsersDb = require("../../models/users/createUserDb");

const signUp = async (req, res) => {
  try {
    foundUser = await findUsersDb(req.body.username);
    console.log("FOUNDUSER:", foundUser);
    if (foundUser) {
      console.log("IN ERROR");
      throw new Error("Username not available");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUserObject = {
      username: req.body.username,
      usernameLowerCase: req.body.username.toLowerCase(),
      password: req.body.password,
      gamerTag: req.body.gamerTag,
      platform: req.body.platform,
      password: hashedPassword,
      png: req.body.png,
    };
    const createUserResult = await createUsersDb(newUserObject);
    res.send({ message: "success" });
  } catch (err) {
    res.send({ message: err.message });
  }
};

module.exports = signUp;
