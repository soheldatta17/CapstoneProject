const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Venue name is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Venue address is required"],
    },
    rows: {
      type: Number,
      required: [true, "Number of rows is required"],
      default: 10,
    },
    cols: {
      type: Number,
      required: [true, "Number of columns per row is required"],
      default: 10,
    },
    capacity: {
      type: Number,
      default: function() {
        return this.rows * this.cols;
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Venue", venueSchema, "Venue");
