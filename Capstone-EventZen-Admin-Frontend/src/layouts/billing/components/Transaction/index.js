

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";

// EventZen React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

function Transaction({ color, icon, name, description, value, reason }) {
  return (
    <MDBox component="li" py={1} pr={2} mb={1}>
      <Grid container alignItems="center" spacing={2}>
        {/* Column 1: Transaction Name */}
        <Grid item xs={12} md={4}>
          <MDBox display="flex" alignItems="center">
            <MDBox mr={2}>
              <MDButton variant="outlined" color={color} iconOnly circular>
                <Icon sx={{ fontWeight: "bold" }}>{icon}</Icon>
              </MDButton>
            </MDBox>
            <MDTypography variant="button" fontWeight="medium">
              {name}
            </MDTypography>
          </MDBox>
        </Grid>

        {/* Column 2: Date & Time */}
        <Grid item xs={12} md={3}>
          <MDTypography variant="caption" color="text" fontWeight="regular">
            <Icon sx={{ verticalAlign: "middle", mr: 0.5, fontSize: "1rem !important" }}>schedule</Icon>
            {description}
          </MDTypography>
        </Grid>

        {/* Column 3: Event Name */}
        <Grid item xs={12} md={3}>
          <MDBox display="flex" alignItems="center">
            {reason && (
              <MDTypography variant="caption" color="text" fontWeight="medium">
                <Icon sx={{ verticalAlign: "middle", mr: 0.5, fontSize: "1rem !important" }}>event</Icon>
                {reason}
              </MDTypography>
            )}
          </MDBox>
        </Grid>

        {/* Column 4: Money (Rupee) */}
        <Grid item xs={12} md={2} sx={{ textAlign: "right" }}>
          <MDTypography variant="button" color={color} fontWeight="bold" textGradient>
            {value.replace('$', '₹')}
          </MDTypography>
        </Grid>
      </Grid>
    </MDBox>
  );
}

// Typechecking props of the Transaction
Transaction.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]).isRequired,
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  reason: PropTypes.string,
};

export default Transaction;
