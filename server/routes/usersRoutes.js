const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users/usersController");
const verifyGamerTagController = require("../controllers/users/verifyGamerTagController");
const signUpController = require("../controllers/users/signUpController");
const signInController = require("../controllers/users/signInController");
const signOutController = require("../controllers/users/signOutController");
const verifyTokenController = require("../controllers/users/verifyTokenController");

router.get("/", usersController);

router.post("/verifyGamerTag", verifyGamerTagController);
router.post("/signUp", signUpController);
router.post("/signIn", signInController);
router.post("/signOut", signOutController);
router.post("/verifyToken", verifyTokenController);

module.exports = router;
