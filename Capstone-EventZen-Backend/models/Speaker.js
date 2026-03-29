const mongoose = require("mongoose");

const speakerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Speaker name is required"],
      trim: true,
    },
    role: {
      type: String,
      trim: true,
      default: "Guest Speaker",
    },
    image: {
      type: String,
      default: null, // URL to avatar
    },
    bio: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Speaker", speakerSchema, "speakers");
