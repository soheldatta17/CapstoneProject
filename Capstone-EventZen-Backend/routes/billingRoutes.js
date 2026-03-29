const express = require("express");
const router = express.Router();
const { getTransactions, getInvoices, getProfiles, getPaymentMethods, getBillingStats, createTransaction } = require("../controllers/billingController");

router.get("/transactions", getTransactions);
router.post("/transactions", createTransaction);
router.get("/invoices", getInvoices);
router.get("/profiles", getProfiles);
router.get("/payment-methods", getPaymentMethods);
router.get("/stats", getBillingStats);

module.exports = router;
