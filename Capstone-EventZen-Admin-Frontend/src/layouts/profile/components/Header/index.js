// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// EventZen React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";

// Images
import backgroundImage from "assets/images/bg-profile.jpeg";

import API_BASE_URL from "apiConfig";

const BACKEND_URL = API_BASE_URL;

function Header({ user, children }) {
  const navigate = useNavigate();
  // Read user from storage (set during sign-in)
  const stored = localStorage.getItem("user") || sessionStorage.getItem("user");
  const fallbackUser = stored ? JSON.parse(stored) : {};
  const activeUser = user || fallbackUser;

  const avatarSrc = activeUser.avatar 
    ? (activeUser.avatar.startsWith("http") ? activeUser.avatar : `${BACKEND_URL}/uploads/${activeUser.avatar}`)
    : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/authentication/sign-in");
  };

  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(rgba(gradients.info.main, 0.6), rgba(gradients.info.state, 0.6))}, url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <MDAvatar
              src={avatarSrc || undefined}
              alt="profile-image"
              size="xl"
              shadow="sm"
              sx={avatarSrc ? {} : { bgcolor: "info.main", fontSize: "2rem" }}
            >
              {!avatarSrc && (activeUser.fullName ? activeUser.fullName.charAt(0).toUpperCase() : "U")}
            </MDAvatar>
          </Grid>
          <Grid item>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                {activeUser.fullName || "User"}
              </MDTypography>
              <MDTypography variant="button" color="text" fontWeight="regular">
                {activeUser.role === "admin" ? "Main Events Administrator" : 
                 activeUser.role === "premium" ? "Premium Organizer" : "Event Enthusiast"}
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
            <MDBox display="flex" justifyContent={{ md: "flex-end" }} alignItems="center">
              <MDButton variant="gradient" color="error" onClick={handleLogout}>
                Logout
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>
        {children}
      </Card>
    </MDBox>
  );
}

Header.defaultProps = {
  user: null,
  children: "",
};

Header.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node,
};

export default Header;
