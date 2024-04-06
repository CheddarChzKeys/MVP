const API = require("call-of-duty-api");
const ssoToken = require("../../../hidden/ssoToken");

const apiLogIn = () => API.login(ssoToken.token);

module.exports = apiLogIn;
