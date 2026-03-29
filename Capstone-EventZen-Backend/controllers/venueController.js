const Venue = require("../models/Venue");

// @desc    Get all venues
// @route   GET /api/venues
const getVenues = async (req, res) => {
  try {
    const venues = await Venue.find();
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch venues" });
  }
};

// Seed Venues
const seedVenues = async () => {
  try {
    const count = await Venue.countDocuments();
    if (count === 0) {
      const sampleVenues = [
        { name: "Grand City Hall", address: "Downtown Manhattan, NY", rows: 10, cols: 12 },
        { name: "Majestic Theatre", address: "Broadway, NY", rows: 8, cols: 8 },
        { name: "Tech Park Arena", address: "Silicon Valley, CA", rows: 15, cols: 20 },
      ];
      await Venue.insertMany(sampleVenues);
      console.log("Sample venues seeded successfully.");
    }
  } catch (error) {
    console.error("Error seeding venues:", error);
  }
};

module.exports = { getVenues, seedVenues };
