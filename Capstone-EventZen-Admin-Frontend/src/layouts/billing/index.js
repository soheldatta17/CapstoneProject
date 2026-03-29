import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

// EventZen React components
import MDBox from "components/MDBox";

// EventZen React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Billing page components
import Invoices from "layouts/billing/components/Invoices";
import Transactions from "layouts/billing/components/Transactions";
import PayoutModal from "layouts/billing/components/PayoutModal";

import API_BASE_URL from "apiConfig";

const API_BASE = `${API_BASE_URL}/api`;

function Billing() {
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [stats, setStats] = useState({ 
    ticketSales: 0, 
    ticketsSold: 0, 
    activeEvents: 0, 
    revenueGrowth: "+0%" 
  });

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [txRes, invRes, profRes, statsRes] = await Promise.all([
          fetch(`${API_BASE}/billing/transactions`, { headers }),
          fetch(`${API_BASE}/billing/invoices`, { headers }),
          fetch(`${API_BASE}/billing/profiles`, { headers }),
          fetch(`${API_BASE}/billing/stats`, { headers }),
        ]);

        if (txRes.ok) setTransactions(await txRes.json());
        if (invRes.ok) setInvoices(await invRes.json());
        if (profRes.ok) setProfiles(await profRes.json());
        if (statsRes.ok) setStats(await statsRes.json());
      } catch (err) {
        console.error("Failed to fetch billing data");
      }
    };
    fetchBillingData();
  }, []);

  const refreshData = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API_BASE}/billing/transactions`, { headers }).then(res => res.json()),
      fetch(`${API_BASE}/billing/stats`, { headers }).then(res => res.json())
    ]).then(([txs, s]) => {
      setTransactions(txs);
      setStats(s);
    });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={4}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="dark"
                  icon="weekend"
                  title="Total Revenue"
                  count={`₹${stats.ticketSales.toLocaleString()}`}
                  percentage={{
                    color: "success",
                    amount: stats.revenueGrowth,
                    label: "than last month",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  icon="leaderboard"
                  title="Tickets Sold"
                  count={stats.ticketsSold}
                  percentage={{
                    color: "success",
                    amount: "+3%",
                    label: "than last month",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="success"
                  icon="store"
                  title="Active Events"
                  count={stats.activeEvents}
                  percentage={{
                    color: "success",
                    amount: "+1",
                    label: "new today",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="primary"
                  icon="event"
                  title="Total Events"
                  count={stats.totalEvents}
                  percentage={{
                    color: "success",
                    amount: "",
                    label: "All active listings",
                  }}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Transactions transactions={transactions} onNewPayout={() => setPayoutOpen(true)} />
            </Grid>
            {/* <Grid item xs={12} lg={4}>
              <Invoices invoices={invoices} />
            </Grid> */}
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
      <PayoutModal 
        open={payoutOpen} 
        onClose={() => { setPayoutOpen(false); refreshData(); }} 
        onSuccess={refreshData} 
      />
    </DashboardLayout>
  );
}

export default Billing;
