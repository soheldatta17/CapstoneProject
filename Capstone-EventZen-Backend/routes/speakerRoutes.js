const express = require("express");
const router = express.Router();
const { getSpeakers } = require("../controllers/speakerController");

// GET /api/speakers — fetch all speakers
router.get("/", getSpeakers);

module.exports = router;
