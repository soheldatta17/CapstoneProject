require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const { seedSpeakers } = require("./controllers/speakerController");
const { seedEvents } = require("./controllers/eventController");
const { seedVenues } = require("./controllers/venueController");
const { seedBillingData } = require("./controllers/billingController");

const app = express();

// Connect to MongoDB then seed core data
connectDB().then(async () => {
  await seedSpeakers();
  await seedVenues();
  // seedEvents and seedBillingData are disabled to maintain a clean slate
  // await seedEvents();
  // await seedBillingData();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files as static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/speakers", require("./routes/speakerRoutes"));
app.use("/api/venues", require("./routes/venueRoutes"));
app.use("/api/billing", require("./routes/billingRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Capstone Backend API is running on port 8000" });
});

// Error handler for multer and others
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(400).json({ error: err.message });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
