const express = require("express");
const router = express.Router();
const jiomartController = require("../controllers/jiomartController");

router.get("/jiomart", jiomartController.scrape);

module.exports = router;
