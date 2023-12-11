const express = require("express");
const router = express.Router();
const amazonController = require("../controllers/amazonController");

router.get("/amazon", amazonController.scrape);

module.exports = router;
