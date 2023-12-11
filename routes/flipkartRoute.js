const express = require("express");
const router = express.Router();
const flipkartController = require("../controllers/flipkartController");

router.get("/flipkart", flipkartController.scrape);

module.exports = router;
