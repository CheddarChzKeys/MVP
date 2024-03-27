const express = require("express");
const router = express.Router();

const getWarzoneStatsController = require("../controllers/getWarzoneStatsController");

router.get("/warzoneStats", getWarzoneStatsController);

module.exports = router;
