// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";

// EventZen React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Billing page components
import Invoice from "layouts/billing/components/Invoice";

function Invoices({ invoices = [] }) {
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Event Invoices
        </MDTypography>
        <MDButton variant="outlined" color="info" size="small">
          view all
        </MDButton>
      </MDBox>
      <MDBox p={2}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {invoices.map((inv, index) => (
            <Invoice
              key={inv._id || index}
              date={new Date(inv.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              id={inv.invoiceId}
              price={`$${inv.amount.toLocaleString()}`}
              noGutter={index === invoices.length - 1}
            />
          ))}
          {invoices.length === 0 && (
            <MDTypography variant="caption" color="text">No invoices found.</MDTypography>
          )}
        </MDBox>
      </MDBox>
    </Card>
  );
}

Invoices.propTypes = {
  invoices: PropTypes.arrayOf(PropTypes.object),
};

export default Invoices;
