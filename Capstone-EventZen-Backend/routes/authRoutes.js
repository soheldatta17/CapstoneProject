const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { signup, signin, upgradeToPremium, updateProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/auth/signup  (multipart/form-data for avatar upload)
router.post("/signup", upload.single("avatar"), signup);

// POST /api/auth/signin  (JSON body)
router.post("/signin", signin);

// POST /api/auth/upgrade (JSON body)
router.post("/upgrade", upgradeToPremium);

// PUT /api/auth/profile (JSON body)
router.put("/profile", protect, updateProfile);

module.exports = router;
