const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");
const verifyController = require("../controllers/verifyGamertagController");
const signUpController = require("../controllers/signUpController");
const logInController = require("../controllers/logInController");
const logOutController = require("../controllers/logOutController");
const verifyTokenController = require("../controllers/verifyTokenController");

router.get("/users"), usersController;

router.post("/verifyGamertag", verifyController);
router.post("/signUp", signUpController);
router.post("/logIn", logInController);
router.post("/logout", logOutController);
router.post("/verifyToken", verifyTokenController);

module.exports = router;
