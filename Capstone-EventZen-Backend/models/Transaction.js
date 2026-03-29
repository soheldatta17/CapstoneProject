const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["income", "expense", "pending"], required: true },
  date: { type: Date, default: Date.now },
  reason: { type: String, default: "" },
  relatedEvent: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  description: { type: String },
});

module.exports = mongoose.model("Transaction", transactionSchema, "Transaction");
