const express = require("express");
const router = express.Router();
const uploadEvent = require("../middleware/uploadEvent");
const { createEvent, getEvents, getEventById, getCalendarEvents } = require("../controllers/eventController");
const { getComments, addComment } = require("../controllers/commentController");
const { getRegistrations, registerForEvent, getOccupiedSeats } = require("../controllers/registrationController");
const { getEventAnalytics } = require("../controllers/analyticsController");
const { protect, authorize } = require("../middleware/authMiddleware");

// ─── Event Collection ───────────────────────────────────────────
// GET  /api/events        — list all events
router.get("/", getEvents);

// GET  /api/events/calendar — lightweight event list for calendar UI (must be before /:id)
router.get("/calendar", getCalendarEvents);


// POST /api/events        — create a new event (multipart: coverImage + promoVideo)
// Only Organizers (Admin or Premium) can create events
router.post(
  "/",
  protect,
  authorize("admin", "premium"),
  uploadEvent.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "promoVideo", maxCount: 1 },
  ]),
  createEvent
);

// ─── Single Event ───────────────────────────────────────────────
// GET  /api/events/:id    — get single event
router.get("/:id", getEventById);

// ─── Comments ───────────────────────────────────────────────────
// GET  /api/events/:id/comments
router.get("/:id/comments", getComments);

// POST /api/events/:id/comments  body: { author, text }
router.post("/:id/comments", addComment);

// ─── Registrations ──────────────────────────────────────────────
// GET  /api/events/:id/registrations
router.get("/:id/registrations", protect, authorize("admin", "premium"), getRegistrations);

// POST /api/events/:id/register  body: { name, email, ticketType, seatNumber, venueId }
router.post("/:id/register", registerForEvent);

// GET /api/events/:id/occupied-seats
router.get("/:id/occupied-seats", getOccupiedSeats);

// GET  /api/events/:id/analytics
router.get("/:id/analytics", protect, authorize("admin", "premium"), getEventAnalytics);

// POST /api/events/:id/rate
router.post("/:id/rate", protect, require("../controllers/registrationController").rateEvent);
// GET  /api/events/:id/analytics
router.get("/:id/analytics", protect, authorize("admin", "premium"), getEventAnalytics);

module.exports = router;
