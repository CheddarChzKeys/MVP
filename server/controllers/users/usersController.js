const findUsersDb = require("../../models/users/findUsersDb");

const getUsersList = async (req, res) => {
  let foundUsers = await findUsersDb();
  const usersList = foundUsers ? foundUsers : [];
  res.status(200).send(usersList);
};

module.exports = getUsersList;
