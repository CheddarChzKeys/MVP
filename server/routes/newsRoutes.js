const express = require("express");
const router = express.Router();

const getNewsController = require("../controllers/getNewsController");
const getMoreNewsController = require("../controllers/getMoreNewsController")

router.get("/getNews", getNewsController);
router.get("/getMoreNews", getMoreNewsController);

module.exports = router;
