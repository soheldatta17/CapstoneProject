const express = require("express");
const router = express.Router();
const { getMyRegistrations } = require("../controllers/registrationController");
const { protect } = require("../middleware/authMiddleware");

// GET /api/users/my-events
router.get("/my-events", protect, getMyRegistrations);

module.exports = router;
