const express = require ("express");
const router = express.Router();

const verifyController = require("../controllers/verifyController");

router.post("/verify", verifyController.verify);

module.exports = router;