const mongoose = require("mongoose");

const speakerEmbedSchema = new mongoose.Schema(
  {
    speakerId: { type: mongoose.Schema.Types.ObjectId, ref: "Speaker", default: null },
    name: { type: String, required: true, trim: true },
    role: { type: String, trim: true, default: "Guest Speaker" },
    image: { type: String, default: null }, // URL or uploaded path
  },
  { _id: false }
);

const locationSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    address: { type: String, trim: true },
    type: { type: String, trim: true },
    icon: { type: String, trim: true },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    eventTitle: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    eventDate: {
      type: Date,
      default: null,
    },
    location: {
      type: locationSchema,
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: null, // relative path under /uploads/events/
    },
    promoVideo: {
      type: String,
      default: null,
    },
    speakers: {
      type: [speakerEmbedSchema],
      default: [],
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Event creator is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema, "events");
