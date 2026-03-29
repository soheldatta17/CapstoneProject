const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  invoiceId: { type: String, required: true },
  amount: { type: Number, required: true },
  pdfUrl: { type: String },
});

module.exports = mongoose.model("Invoice", invoiceSchema, "Invoice");
