const express = require("express");
const router = express.Router();

const getNewestGalleryController = require("../controllers/gallery/getNewestGalleryController");
const getPrevGalleryController = require("../controllers/gallery/getPrevGalleryController");
const getNextGalleryController = require("../controllers/gallery/getNextGalleryController");
const addGalleryContentController = require("../controllers/gallery/addGalleryContentController");

router.get("/getNewest", getNewestGalleryController);
router.get("/getPrev", getPrevGalleryController);
router.get("/getNext", getNextGalleryController);

router.post("/add", addGalleryContentController);

module.exports = router;
