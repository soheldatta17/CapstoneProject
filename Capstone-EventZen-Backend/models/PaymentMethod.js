const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema({
  type: { type: String, enum: ["mastercard", "visa"], required: true },
  last4: { type: String, required: true },
  holder: { type: String },
  expires: { type: String },
  isDefault: { type: Boolean, default: false },
});

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema, "PaymentMethod");
