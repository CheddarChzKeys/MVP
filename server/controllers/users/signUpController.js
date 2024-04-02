const bcrypt = require("bcrypt");
const dbClient = require("../../dbAccess");

const findUsersDb = require("../../models/users/findUsersDb");
const createUsersDb = require ("../../models/users/createUserDb");

const signUp = async (req, res) => {
  foundUser = await findUsersDb(req.body.username);

  if (foundUser) {
    res.send("Username taken");
  } else {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    const newUserObject = {
    username: req.body.username,
    usernameLowerCase: req.body.username.toLowerCase(),
    password: req.body.password,
    gamerTag: req.body.gamerTag,
    platform: req.body.platform,
    password: hashedPassword,
    png: req.body.png
    }
    
    const createUserResult = await createUsersDb(newUserObject);
    if (createUserResult.acknowledged) {
      res.send("New soldier enlisted");
    }
  };
};

module.exports = signUp;
