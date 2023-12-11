const express = require("express");
const router = express.Router();
const nykaaController = require("../controllers/nykaaController");

router.get("/nykaa", nykaaController.scrape);

module.exports = router;
