const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users/usersController");
const verifyGamerTagController = require("../controllers/users/verifyGamerTagController");
const signUpController = require("../controllers/users/signUpController");
const logInController = require("../controllers/users/logInController");
const logOutController = require("../controllers/users/logOutController");
const verifyTokenController = require("../controllers/users/verifyTokenController");

router.get("/", usersController);

router.post("/verifyGamerTag", verifyGamerTagController);
router.post("/signUp", signUpController);
router.post("/logIn", logInController);
router.post("/logout", logOutController);
router.post("/verifyToken", verifyTokenController);

module.exports = router;
