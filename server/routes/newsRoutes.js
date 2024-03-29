const express = require("express");
const router = express.Router();

const getNewsController = require("../controllers/news/getNewsController");
const getMoreNewsController = require("../controllers/news/getMoreNewsController")

router.get("/getNews", getNewsController);
router.get("/getMoreNews", getMoreNewsController);

module.exports = router;
