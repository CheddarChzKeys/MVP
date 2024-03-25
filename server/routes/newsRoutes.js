const express = require("express");
const router = express.Router();

const getNewsController = require("../controllers/getNewsController");

router.get("/getNews", getNewsController);

module.exports = router;
