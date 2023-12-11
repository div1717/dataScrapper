const express = require("express");
const router = express.Router();
const snapdealController = require("../controllers/snapdealController");

router.get("/snapdeal", snapdealController.scrape);

module.exports = router;
