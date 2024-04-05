const findUsersDb = require("../../models/users/findUsersDb");

const getUsersList = async (req, res) => {
  try {
    const foundUsers = await findUsersDb();
    res.send(foundUsers);
  } catch (err) {
    console.log(`Error: ${err}`);
    res.send([]);
  }
};

module.exports = getUsersList;
