const express = require("express");
const router = express.Router();

const verifyController = require("../controllers/verifyController");
const signUpController = require("../controllers/signUpController");

router.post("/verify", verifyController);
router.post("/signUp", signUpController);

module.exports = router;
