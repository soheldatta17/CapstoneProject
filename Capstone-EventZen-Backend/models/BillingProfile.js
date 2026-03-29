const mongoose = require("mongoose");

const billingProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  email: { type: String, required: true },
  vat: { type: String, required: true },
});

module.exports = mongoose.model("BillingProfile", billingProfileSchema, "BillingProfile");
