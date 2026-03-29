const path = require("path");
const Event = require("../models/Event");

// POST /api/events
const createEvent = async (req, res) => {
  try {
    const { eventTitle, eventDate, location, description, speakers, venue } = req.body;

    if (!eventTitle) {
      return res.status(400).json({ error: "Event title is required." });
    }

    // Files uploaded by multer-storage-cloudinary (file.path is the Cloudinary URL)
    const coverImage = req.files?.coverImage?.[0]
      ? req.files.coverImage[0].path
      : null;
    const promoVideo = req.files?.promoVideo?.[0]
      ? req.files.promoVideo[0].path
      : null;

    // Parse JSON strings sent via FormData
    let parsedLocation = null;
    if (location) {
      try {
        parsedLocation = typeof location === "string" ? JSON.parse(location) : location;
      } catch {
        parsedLocation = null;
      }
    }

    let parsedSpeakers = [];
    if (speakers) {
      try {
        parsedSpeakers = typeof speakers === "string" ? JSON.parse(speakers) : speakers;
      } catch {
        parsedSpeakers = [];
      }
    }

    // -- Time-conflict check: same exact datetime is not allowed --
    if (eventDate) {
      const existingAtSameTime = await Event.findOne({ eventDate: new Date(eventDate) });
      if (existingAtSameTime) {
        return res.status(409).json({
          error: `Another event is already scheduled at this exact time: "${existingAtSameTime.eventTitle}". You can schedule events on the same day but not at the same time.`,
        });
      }
    }

    const event = await Event.create({
      eventTitle,
      eventDate: eventDate || null,
      location: parsedLocation,
      description: description || "",
      coverImage,
      promoVideo,
      speakers: parsedSpeakers,
      venue: venue || null,
      createdBy: req.user?._id || null, // req.user populated by protect middleware
    });

    res.status(201).json({ message: "Event published successfully!", event });
  } catch (err) {
    console.error("createEvent error:", err);
    res.status(500).json({ error: err.message || "Failed to create event." });
  }
};

// GET /api/events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("venue").sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events." });
  }
};

// GET /api/events/:id
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found." });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch event." });
  }
};

// GET /api/events/calendar — lightweight list for calendar rendering
const getCalendarEvents = async (req, res) => {
  try {
    const events = await Event.find(
      { eventDate: { $ne: null } },
      { eventTitle: 1, eventDate: 1, coverImage: 1, location: 1 }
    ).sort({ eventDate: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch calendar events." });
  }
};

// Seed sample events on startup if the events collection is empty
const seedEvents = async () => {
  try {
    const count = await Event.countDocuments();
    if (count > 0) return; // already have events

    const { seedRegistrationsForEvent } = require("./registrationController");
    const User = require("../models/User");

    // We need a user to assign as the creator of seeded events
    let admin = await User.findOne({ role: "admin" });
    if (!admin) admin = await User.findOne({ role: "premium" });
    if (!admin) admin = await User.findOne(); // first available user

    if (!admin) {
      console.log("No user found in DB for seeding events. Skipping seeding.");
      return;
    }

    const Venue = require("../models/Venue");
    const venues = await Venue.find();
    if (venues.length === 0) {
      console.log("No venues found in DB for seeding events. Skipping seeding.");
      return;
    }

    const SEED_EVENTS = [
      {
        eventTitle: "Majestic Developers Summit 2026",
        eventDate: new Date("2026-04-15T09:00:00"),
        location: { title: "Tech Park Arena", address: "Silicon Valley, CA", type: "convention", icon: "business" },
        description: "<p>A deep-dive into the future of Agentic AI, high-performance distributed systems, and modern web architectures.</p>",
        coverImage: null,
        promoVideo: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        venue: venues[0]._id,
        speakers: [
          { name: "James O'Brien", role: "Cybersecurity Expert", image: "https://randomuser.me/api/portraits/men/14.jpg" },
          { name: "Dr. Aisha Rahman", role: "AI Research Scientist", image: "https://randomuser.me/api/portraits/women/44.jpg" },
        ],
        createdBy: admin._id,
      },
      {
        eventTitle: "Global Creators Conference",
        eventDate: new Date("2026-04-26T16:00:00"),
        location: { title: "Grand Hyatt Hotel", address: "New York, NY", type: "hotel", icon: "hotel" },
        description: "<p>An interactive creator economy event about storytelling, monetization, and short-form video strategy.</p>",
        coverImage: null,
        promoVideo: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        venue: venues[1]._id,
        speakers: [
          { name: "Marcos Silva", role: "Full Stack Engineer", image: "https://randomuser.me/api/portraits/men/32.jpg" },
          { name: "Priya Mehta", role: "Product Manager", image: "https://randomuser.me/api/portraits/women/65.jpg" },
          { name: "Carlos Mendez", role: "Blockchain Developer", image: "https://randomuser.me/api/portraits/men/75.jpg" },
        ],
        createdBy: admin._id,
      },
      {
        eventTitle: "Urban Wedding Expo",
        eventDate: new Date("2026-05-03T11:00:00"),
        location: { title: "Sydney Opera House", address: "Sydney, AUS", type: "theater", icon: "theater_comedy" },
        description: "<p>Top planners, stylists, and photographers share practical planning tips and modern wedding themes.</p>",
        coverImage: null,
        promoVideo: null,
        venue: venues[2]._id || venues[0]._id,
        speakers: [
          { name: "Yuki Tanaka", role: "UX Design Lead", image: "https://randomuser.me/api/portraits/women/29.jpg" },
          { name: "Carlos Mendez", role: "Blockchain Developer", image: "https://randomuser.me/api/portraits/men/75.jpg" },
        ],
        createdBy: admin._id,
      },
      {
        eventTitle: "Future of Product Design",
        eventDate: new Date("2026-05-10T13:30:00"),
        location: { title: "Madison Square Garden", address: "New York, NY", type: "stadium", icon: "stadium" },
        description: "<p>Deep-dive talks on design systems, UX research operations, and AI-assisted prototyping workflows.</p>",
        coverImage: null,
        promoVideo: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        venue: venues[0]._id,
        speakers: [
          { name: "Priya Mehta", role: "Product Manager", image: "https://randomuser.me/api/portraits/women/65.jpg" },
          { name: "James O'Brien", role: "Cybersecurity Expert", image: "https://randomuser.me/api/portraits/men/14.jpg" },
          { name: "Fatima Al-Sayed", role: "Data Scientist", image: "https://randomuser.me/api/portraits/women/12.jpg" },
        ],
        createdBy: admin._id,
      },
      {
        eventTitle: "Outdoor Music Business Meetup",
        eventDate: new Date("2026-05-22T18:45:00"),
        location: { title: "Central Park", address: "New York, NY", type: "park", icon: "park" },
        description: "<p>Festival founders and artist managers cover sponsorship strategy, audience growth, and stage operations.</p>",
        coverImage: null,
        promoVideo: null,
        venue: venues[1]._id,
        speakers: [
          { name: "Dr. Aisha Rahman", role: "AI Research Scientist", image: "https://randomuser.me/api/portraits/women/44.jpg" },
          { name: "Marcos Silva", role: "Full Stack Engineer", image: "https://randomuser.me/api/portraits/men/32.jpg" },
          { name: "James O'Brien", role: "Cybersecurity Expert", image: "https://randomuser.me/api/portraits/men/14.jpg" },
        ],
        createdBy: admin._id,
      },
    ];

    const created = await Event.insertMany(SEED_EVENTS);
    console.log("Seeded sample events.");

    const Comment = require("../models/Comment");
    for (const ev of created.slice(0, 3)) {
      await seedRegistrationsForEvent(ev._id);

      await Comment.insertMany([
        { eventId: ev._id, author: "Rhea Sharma", text: "Loved the speaker lineup, please share session timing breakdown as well." },
        { eventId: ev._id, author: "Marcus Lee", text: "Venue details look great. Parking info would help attendees." },
        { eventId: ev._id, author: "Ananya Rao", text: "Video preview feels premium. Registration flow is smooth." },
      ]);
    }

    console.log("Seeded sample registrations and comments.");
  } catch (err) {
    console.error("Failed to seed events:", err.message);
  }
};

module.exports = { createEvent, getEvents, getEventById, getCalendarEvents, seedEvents };

