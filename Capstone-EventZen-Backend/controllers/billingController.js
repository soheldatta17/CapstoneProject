const Transaction = require("../models/Transaction");
const Invoice = require("../models/Invoice");
const BillingProfile = require("../models/BillingProfile");
const PaymentMethod = require("../models/PaymentMethod");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

// @desc    Get all transactions
// @route   GET /api/billing/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('relatedEvent', 'eventTitle venue')
      .sort({ date: -1 })
      .limit(10);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

// @desc    Get all invoices
// @route   GET /api/billing/invoices
// @access  Private
const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ date: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
};

// @desc    Get billing profiles
// @route   GET /api/billing/profiles
// @access  Private
const getProfiles = async (req, res) => {
  try {
    const profiles = await BillingProfile.find();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profiles" });
  }
};

// @desc    Get payment methods
// @route   GET /api/billing/payment-methods
// @access  Private
const getPaymentMethods = async (req, res) => {
  try {
    const methods = await PaymentMethod.find();
    res.json(methods);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payment methods" });
  }
};

// @desc    Get billing statistics
// @route   GET /api/billing/stats
// @access  Private
const getBillingStats = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const totalEvents = await Event.countDocuments();
    const ticketsSold = await Registration.countDocuments();
    
    // Calculate revenue from income transactions (e.g. ticket settlements, sponsor deposits)
    const ticketSales = transactions
      .filter(t => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
    
    // Vendor payouts (expenses)
    const vendorPayouts = transactions
      .filter(t => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);

    // Active events (events with date >= today)
    const activeEvents = await Event.countDocuments({ 
      eventDate: { $gte: new Date() } 
    });
    
    res.json({ 
      ticketSales, 
      vendorPayouts,
      ticketsSold, 
      activeEvents, 
      totalEvents,
      revenueGrowth: "+15%" 
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to calculate statistics" });
  }
};

// @desc    Create custom payout transaction
// @route   POST /api/billing/transactions
// @access  Private
const createTransaction = async (req, res) => {
  try {
    const { name, description, amount, type, reason, relatedEvent } = req.body;
    
    // Optional basic validation 
    if (!name || !amount || !type) {
      return res.status(400).json({ error: "Missing required transaction fields" });
    }

    const t = new Transaction({
      name,
      description: description || new Date().toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      amount,
      type,
      reason,
      relatedEvent: relatedEvent || null,
      date: new Date()
    });

    await t.save();
    
    const populated = await Transaction.findById(t._id).populate('relatedEvent', 'eventTitle venue');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: "Failed to create transaction" });
  }
};

// @desc    Seed initial billing data
const seedBillingData = async () => {
  try {
    const tCount = await Transaction.countDocuments();
    if (tCount === 0) {
      await Transaction.insertMany([
        { name: "Vendor Payout - Catering", amount: 3200, type: "expense", description: "16 March 2026, at 01:15 PM" },
        { name: "Ticket Settlement - Spring Expo", amount: 5860, type: "income", description: "16 March 2026, at 09:40 AM" },
        { name: "Sponsor Deposit - Nova Corp", amount: 2500, type: "income", description: "15 March 2026, at 07:45 PM" },
        { name: "Venue Advance - Skyline Hall", amount: 1750, type: "expense", description: "15 March 2026, at 04:20 PM" },
        { name: "Booth Booking - Design Summit", amount: 1200, type: "income", description: "15 March 2026, at 11:10 AM" },
        { name: "Refund Request - Music Fest", amount: 120, type: "pending", description: "15 March 2026, at 08:05 AM" }
      ]);
    }

    const iCount = await Invoice.countDocuments();
    if (iCount === 0) {
      await Invoice.insertMany([
        { date: new Date("2026-03-01"), invoiceId: "#MS-415646", amount: 180 },
        { date: new Date("2026-02-10"), invoiceId: "#RV-126749", amount: 250 },
        { date: new Date("2026-04-05"), invoiceId: "#QW-103578", amount: 120 },
        { date: new Date("2026-06-25"), invoiceId: "#MS-415648", amount: 180 },
        { date: new Date("2026-03-01"), invoiceId: "#AR-803481", amount: 300 }
      ]);
    }

    const pCount = await BillingProfile.countDocuments();
    if (pCount === 0) {
      await BillingProfile.insertMany([
        { name: "Mia Sharma", company: "Stellar Events", email: "billing@stellarevents.com", vat: "IN-GST-29AAI9021K1ZV" },
        { name: "Noah Brown", company: "Grand Hall Productions", email: "accounts@grandhallpro.com", vat: "US-EIN-84-5672190" },
        { name: "Ava Wilson", company: "EventZen Studios", email: "finance@eventzen.com", vat: "US-EIN-93-1827644" }
      ]);
    }

    const mCount = await PaymentMethod.countDocuments();
    if (mCount === 0) {
      await PaymentMethod.insertMany([
        { type: "mastercard", last4: "7852", holder: "EventZen Operations", expires: "11/28", isDefault: true },
        { type: "mastercard", last4: "1108" },
        { type: "visa", last4: "7824" }
      ]);
    }

  } catch (error) {
    console.error("Failed to seed billing info", error);
  }
};

module.exports = {
  getTransactions,
  getInvoices,
  getProfiles,
  getPaymentMethods,
  getBillingStats,
  createTransaction,
  seedBillingData
};
