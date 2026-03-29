// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// EventZen React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// EventZen React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Overview page components
import Header from "layouts/profile/components/Header";
import API_BASE_URL from "apiConfig";

function Overview() {
  const [storedUser, setStoredUser] = useState(() => {
    const stored = localStorage.getItem("user") || sessionStorage.getItem("user");
    return stored ? JSON.parse(stored) : {};
  });
  
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: storedUser.fullName || "",
    mobileNumber: storedUser.mobileNumber || "",
    description: storedUser.description || "",
    location: storedUser.location || "",
    facebook: storedUser.social?.facebook || "",
    twitter: storedUser.social?.twitter || "",
    instagram: storedUser.social?.instagram || "",
  });

  const [stats, setStats] = useState({
    activeEvents: 0,
    ticketsSold: 0,
    ticketSales: 0,
  });

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/billing/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch profile stats:", err);
    }
  };

  useState(() => {
    fetchStats();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          mobileNumber: formData.mobileNumber,
          description: formData.description,
          location: formData.location,
          social: {
            facebook: formData.facebook,
            twitter: formData.twitter,
            instagram: formData.instagram
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        setStoredUser(data.user);
        
        // Update local storage so Header picks it up next refresh
        if (localStorage.getItem("user")) localStorage.setItem("user", JSON.stringify(data.user));
        if (sessionStorage.getItem("user")) sessionStorage.setItem("user", JSON.stringify(data.user));

        handleClose();
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header user={storedUser}>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={7}>
              <ProfileInfoCard
                title="admin profile"
                description={storedUser.description || "No bio provided."}
                info={{
                  fullName: storedUser.fullName || "Not provided",
                  mobile: storedUser.mobileNumber || "Not provided",
                  email: storedUser.workEmail || "Not provided",
                  location: storedUser.location || "Not provided",
                }}
                social={[
                  {
                    link: storedUser.social?.facebook || "",
                    icon: <FacebookIcon />,
                    color: "facebook",
                  },
                  {
                    link: storedUser.social?.twitter || "",
                    icon: <TwitterIcon />,
                    color: "twitter",
                  },
                  {
                    link: storedUser.social?.instagram || "",
                    icon: <InstagramIcon />,
                    color: "instagram",
                  },
                ].filter(s => s.link && s.link !== "")}
                action={{ tooltip: "Edit Profile", onClick: handleOpen }}
                shadow={false}
              />
            </Grid>

            <Grid item xs={12} lg={5}>
              <Card sx={{ height: "100%" }}>
                <MDBox p={2.5}>
                  <MDTypography variant="h6" fontWeight="medium" mb={2}>
                    Operations Snapshot
                  </MDTypography>

                  <MDBox display="flex" alignItems="center" mb={1.5}>
                    <Icon color="info" sx={{ mr: 1 }}>event</Icon>
                    <MDTypography variant="button" color="text">Active Events: {stats.activeEvents}</MDTypography>
                  </MDBox>
                  <MDBox display="flex" alignItems="center" mb={1.5}>
                    <Icon color="info" sx={{ mr: 1 }}>groups</Icon>
                    <MDTypography variant="button" color="text">Total Registrations: {stats.ticketsSold}</MDTypography>
                  </MDBox>
                  <MDBox display="flex" alignItems="center" mb={1.5}>
                    <Icon color="info" sx={{ mr: 1 }}>payments</Icon>
                    <MDTypography variant="button" color="text">Total Revenue: ₹{stats.ticketSales.toLocaleString()}</MDTypography>
                  </MDBox>
                  <MDBox display="flex" alignItems="center">
                    <Icon color="info" sx={{ mr: 1 }}>campaign</Icon>
                    <MDTypography variant="button" color="text">System Status: Active</MDTypography>
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>

          </Grid>
        </MDBox>
      </Header>
      <Footer />

      {/* Edit Profile Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Profile Information</DialogTitle>
        <DialogContent>
          <MDBox pt={2} pb={2}>
            <MDInput
              name="fullName"
              label="Full Name"
              fullWidth
              value={formData.fullName}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <MDInput
              name="mobileNumber"
              label="Mobile Number"
              fullWidth
              value={formData.mobileNumber}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <MDInput
              name="description"
              label="Bio / Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <MDInput
              name="location"
              label="Location"
              fullWidth
              value={formData.location}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <MDInput
              name="facebook"
              label="Facebook URL"
              fullWidth
              value={formData.facebook}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <MDInput
              name="twitter"
              label="Twitter URL"
              fullWidth
              value={formData.twitter}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <MDInput
              name="instagram"
              label="Instagram URL"
              fullWidth
              value={formData.instagram}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
          </MDBox>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleClose} color="secondary">Cancel</MDButton>
          <MDButton onClick={handleSave} variant="gradient" color="info">Save Changes</MDButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Overview;
