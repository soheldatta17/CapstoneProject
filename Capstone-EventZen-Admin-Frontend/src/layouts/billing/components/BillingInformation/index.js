// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// EventZen React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Billing page components
import Bill from "layouts/billing/components/Bill";

function BillingInformation({ profiles = [] }) {
  return (
    <Card id="billing-information">
      <MDBox pt={3} px={2}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} sm={8}>
            <MDTypography variant="h6" fontWeight="medium">
              Organizer Billing Profiles
            </MDTypography>
            <MDTypography variant="caption" color="text">
              Manage organizer accounts for invoicing, settlements, and payout tracking.
            </MDTypography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: { xs: "left", sm: "right" } }}>
            <MDButton variant="gradient" color="info" size="small">
              + Add Organizer
            </MDButton>
          </Grid>
        </Grid>
      </MDBox>

      <MDBox pt={1} pb={2} px={2}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {profiles.map((p, index) => (
            <Bill
              key={p._id || index}
              name={p.name}
              company={p.company}
              email={p.email}
              vat={p.vat}
              noGutter={index === profiles.length - 1}
            />
          ))}
          {profiles.length === 0 && (
            <MDTypography variant="caption" color="text">No profiles found.</MDTypography>
          )}
        </MDBox>
      </MDBox>
    </Card>
  );
}

BillingInformation.propTypes = {
  profiles: PropTypes.arrayOf(PropTypes.object),
};

export default BillingInformation;
