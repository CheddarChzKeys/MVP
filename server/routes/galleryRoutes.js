const express = require("express");
const router = express.Router();

const getNewestGalleryController = require("../controllers/getNewestGalleryController");
const getPrevGalleryController = require("../controllers/getPrevGalleryController");
const getNextGalleryController = require("../controllers/getNextGalleryController");
const addGalleryController = require("../controllers/addGalleryController");

router.get("/getNewest", getNewestGalleryController);
router.get("/getPrev", getPrevGalleryController);
router.get("/getNext", getNextGalleryController);

router.post("/add", addGalleryController);

module.exports = router;
