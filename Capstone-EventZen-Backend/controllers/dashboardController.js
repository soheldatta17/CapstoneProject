const Event = require("../models/Event");
const Registration = require("../models/Registration");
const Transaction = require("../models/Transaction");
const Venue = require("../models/Venue");

// @desc    Get dashboard summary statistics and chart data
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    // 1. Statistics Cards
    const activeEventsCount = await Event.countDocuments({ 
      eventDate: { $gte: new Date() } 
    });
    const totalAttendees = await Registration.countDocuments();
    
    const transactions = await Transaction.find();
    const totalSales = transactions
      .filter(t => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);

    const pendingRequests = 5; // Placeholder for now or count based on a field if added

    // 2. Bar Chart Data (Weekly Page Views - Mocked as Weekly Registrations)
    // In a real app, this would be from a 'Views' table. 
    // Here we'll use registrations from the last 7 days distributed across M-S
    const barChartData = {
      labels: ["M", "T", "W", "T", "F", "S", "S"],
      datasets: { label: "Registrations", data: [40, 20, 10, 22, 50, 10, 40] },
    };

    // 3. Line Chart Data (Sales Trends - Monthly)
    // We'll calculate last 9 months revenue
    const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const salesData = [500, 400, 3000, 3200, 5000, 3500, 2000, 2300, totalSales]; // Using totalSales for the latest month
    
    const salesChart = {
      labels: months,
      datasets: { label: "Ticket Sales (₹)", data: salesData },
    };

    // 4. Registration Trends (Monthly)
    const regData = [50, 40, 300, 220, 500, 250, 400, 230, totalAttendees];
    const registrationChart = {
      labels: months,
      datasets: { label: "Attendees", data: regData },
    };

    // 5. Recent Events (Event Schedules Table)
    // Get latest 6 events with calculated metrics
    const recentEventsRaw = await Event.find()
      .populate("venue")
      .sort({ createdAt: -1 })
      .limit(6);

    const recentEvents = await Promise.all(recentEventsRaw.map(async (event) => {
      const registrations = await Registration.find({ eventId: event._id });
      const revenue = registrations.reduce((acc, r) => acc + (r.price || 0), 0);
      
      const capacity = event.venue?.capacity || 100;
      const ticketsSold = registrations.length;
      const progress = Math.min(Math.round((ticketsSold / capacity) * 100), 100);

      return {
        id: event._id,
        title: event.eventTitle,
        date: event.eventDate ? new Date(event.eventDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "TBA",
        revenue: `₹${revenue.toLocaleString()}`,
        progress: progress,
        speakers: event.speakers.map(s => ({ name: s.name, image: s.image })),
        coverImage: event.coverImage
      };
    }));

    // 6. Timeline (Recent Activities)
    const timeline = [
      {
        color: "success",
        icon: "event",
        title: `New Event Published: '${recentEvents[0]?.title || "Upcoming Expo"}'`,
        dateTime: "JUST NOW",
      },
      {
        color: "info",
        icon: "person_add",
        title: `Total registrations reached ${totalAttendees}`,
        dateTime: "TODAY",
      },
      {
        color: "warning",
        icon: "payment",
        title: `Latest Settlement: ₹${transactions[0]?.amount || 0}`,
        dateTime: "YESTERDAY",
      },
      {
        color: "primary",
        icon: "assignment_ind",
        title: "Vendor desk contact updated",
        dateTime: "2 DAYS AGO",
      },
      {
        color: "success",
        icon: "paid",
        title: "Revenue report synchronized",
        dateTime: "3 DAYS AGO",
        lastItem: true
      }
    ];

    res.json({
      stats: {
        activeEvents: activeEventsCount,
        totalAttendees,
        ticketSales: totalSales,
        pendingRequests
      },
      charts: {
        barChart: barChartData,
        salesChart,
        registrationChart
      },
      recentEvents,
      timeline
    });

  } catch (err) {
    console.error("Dashboard data error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

module.exports = { getDashboardData };
