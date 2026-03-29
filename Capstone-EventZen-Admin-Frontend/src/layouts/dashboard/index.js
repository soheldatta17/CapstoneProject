

// @mui material components
import Grid from "@mui/material/Grid";

// EventZen React components
import MDBox from "components/MDBox";

// EventZen React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

import { useState, useEffect } from "react";
import API_BASE_URL from "apiConfig";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = dashboardData?.stats || {
    activeEvents: 0,
    totalAttendees: 0,
    ticketSales: 0,
    pendingRequests: 0
  };

  const charts = dashboardData?.charts || {
    barChart: reportsBarChartData,
    salesChart: reportsLineChartData.sales,
    registrationChart: reportsLineChartData.tasks
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="event"
                title="Active Events"
                count={stats.activeEvents}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Live from database",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="groups"
                title="Total Attendees"
                count={stats.totalAttendees.toLocaleString()}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Across all events",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="confirmation_number"
                title="Ticket Sales"
                count={`₹${stats.ticketSales.toLocaleString()}`}
                percentage={{
                  color: "success",
                  amount: "+15%",
                  label: "vs last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="pending_actions"
                title="Pending Requests"
                count={stats.pendingRequests}
                percentage={{
                  color: "secondary",
                  amount: "",
                  label: "Needing review",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Weekly Growth"
                  description="New registrations per day"
                  date="updated just now"
                  chart={charts.barChart}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Sales Trends"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in ticket sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={charts.salesChart}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="Registration Trends"
                  description="Monthly attendee signups"
                  date="just updated"
                  chart={charts.registrationChart}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects title="Recent Event Schedules" data={dashboardData?.recentEvents || []} />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview timeline={dashboardData?.timeline || []} />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
