const Registration = require("../models/Registration");
const Transaction = require("../models/Transaction");

// GET /api/events/:id/registrations
const getRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ eventId: req.params.id })
      .sort({ createdAt: -1 });

    const total = registrations.length;
    const checkedIn = registrations.filter((r) => r.checkedIn).length;

    const breakdown = {
      General: registrations.filter((r) => r.ticketType === "General").length,
      Premium: registrations.filter((r) => r.ticketType === "Premium").length,
      VIP: registrations.filter((r) => r.ticketType === "VIP").length,
      Sponsor: registrations.filter((r) => r.ticketType === "Sponsor").length,
    };

    // Add full avatar URL to each registration if it's missing or a relative path
    const registrationsWithLinks = registrations.map(reg => {
      const obj = reg.toObject();
      if (obj.avatar && !obj.avatar.startsWith('http')) {
        obj.avatar = `/uploads/${obj.avatar.replace(/^\//, '')}`;
      }
      return obj;
    });

    res.json({ total, checkedIn, breakdown, registrations: registrationsWithLinks });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch registrations." });
  }
};

// POST /api/events/:id/register
const registerForEvent = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const { name, email, ticketType, seatNumber, venueId, avatar, userId, price } = req.body;

    if (!seatNumber) {
      return res.status(400).json({ error: "Please select a seat" });
    }

    // Time conflict check
    const Event = require("../models/Event");
    const requestedEvent = await Event.findById(eventId);
    if (!requestedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (requestedEvent.eventDate) {
      // Find user's existing registrations
      const existingRegistrations = await Registration.find({ email: email.trim().toLowerCase() }).populate("eventId");
      
      const requestedTime = new Date(requestedEvent.eventDate).getTime();
      
      for (const reg of existingRegistrations) {
        if (reg.eventId && reg.eventId.eventDate && reg.eventId._id.toString() !== eventId) {
          const existingTime = new Date(reg.eventId.eventDate).getTime();
          // Check if same exact time (conflict)
          if (existingTime === requestedTime) {
            return res.status(400).json({ error: "Time Conflict: You are already registered for another event at this exact time." });
          }
        }
      }
    }

    let userAvatar = avatar || "";
    if (!userAvatar && userId) {
      const User = require("../models/User");
      const user = await User.findById(userId);
      if (user && user.avatar) userAvatar = user.avatar;
    }

    const registration = new Registration({
      eventId,
      venueId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      ticketType: ticketType || "General",
      seatNumber,
      avatar: userAvatar,
      price: price || 0
    });

    await registration.save();

    // Create a Billing Transaction for this booking
    try {
      const transaction = new Transaction({
        name: `Ticket Booking - ${name}`,
        amount: price || 0,
        type: "income",
        reason: "Ticket Settlement",
        relatedEvent: eventId,
        date: new Date(),
        description: `Booking for ${requestedEvent.eventTitle} (Seat: ${seatNumber})`
      });
      await transaction.save();
    } catch (txError) {
      console.error("Failed to create billing transaction for booking:", txError);
      // We don't fail the registration if transaction fails, but we should log it
    }

    res.status(201).json({
      message: "Successfully registered!",
      registration,
    });
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern.email) {
        return res.status(400).json({ error: "This email is already registered for this event" });
      }
      if (error.keyPattern.seatNumber) {
        return res.status(400).json({ error: "This seat is already booked. Please pick another one." });
      }
    }
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to register" });
  }
};

// @desc    Get occupied seats for an event
// @route   GET /api/events/:id/occupied-seats
const getOccupiedSeats = async (req, res) => {
  try {
    const { id } = req.params;
    const registrations = await Registration.find({ eventId: id }).select("seatNumber");
    const occupied = registrations.map(r => r.seatNumber);
    res.status(200).json(occupied);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch occupied seats" });
  }
};

// Seed sample registrations for an event (used internally)
const seedRegistrationsForEvent = async (eventId) => {
  try {
    const existing = await Registration.countDocuments({ eventId });
    if (existing > 0) return;

    const Event = require("../models/Event");
    const event = await Event.findById(eventId);
    if (!event || !event.venue) return;

    const SAMPLE = [
      { name: "Sophia Carter", email: "sophia@example.com", ticketType: "VIP", seatNumber: "A-1" },
      { name: "Liam Brooks", email: "liam@example.com", ticketType: "VIP", seatNumber: "A-2" },
      { name: "Olivia James", email: "olivia@example.com", ticketType: "Premium", seatNumber: "C-1" },
      { name: "Noah Rivera", email: "noah@example.com", ticketType: "General", seatNumber: "E-1" },
      { name: "Ava Turner", email: "ava@example.com", ticketType: "VIP", seatNumber: "B-2" },
      { name: "Elijah Reed", email: "elijah@example.com", ticketType: "Premium", seatNumber: "D-1" },
    ];

    await Registration.insertMany(SAMPLE.map((r) => ({ ...r, eventId, venueId: event.venue })));
  } catch (err) {
    console.error("Seed error for registrations:", err.message);
  }
};

// @desc    Get user's registered events
// @route   GET /api/users/my-events
const getMyRegistrations = async (req, res) => {
  try {
    // Requires target email or protect middleware usage
    // We'll use email from user token
    const email = req.user.workEmail.toLowerCase();
    const registrations = await Registration.find({ email })
      .populate("eventId")
      .populate("venueId")
      .sort({ createdAt: -1 });

    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch your events" });
  }
};

// @desc    Rate an event
// @route   POST /api/events/:id/rate
const rateEvent = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const { rating, review } = req.body;
    const email = req.user.workEmail.toLowerCase();

    if (!rating) return res.status(400).json({ error: "Rating is required" });

    const registration = await Registration.findOne({ eventId, email });
    if (!registration) {
      return res.status(404).json({ error: "You are not registered for this event" });
    }

    // Check if event has passed
    const Event = require("../models/Event");
    const event = await Event.findById(eventId);
    if (event.eventDate && new Date() < new Date(event.eventDate)) {
       // Optional: enforce rating only for past events
       // return res.status(400).json({ error: "You can only rate events that have already happened." });
    }

    registration.rating = rating;
    if (review) registration.review = review;
    await registration.save();

    res.status(200).json({ message: "Rating submitted successfully", registration });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit rating" });
  }
};

module.exports = {
  getRegistrations,
  registerForEvent,
  getOccupiedSeats,
  seedRegistrationsForEvent,
  getMyRegistrations,
  rateEvent
};
