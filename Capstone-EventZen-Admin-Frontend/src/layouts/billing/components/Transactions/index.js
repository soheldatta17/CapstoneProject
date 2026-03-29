// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
// import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// EventZen React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Billing page components
import Transaction from "layouts/billing/components/Transaction";

function Transactions({ transactions = [], onNewPayout }) {
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium">
          Event Transactions
        </MDTypography>
        <MDBox display="flex" alignItems="center">
          <MDButton variant="outlined" color="info" size="small" onClick={onNewPayout}>
            <Icon sx={{ fontWeight: "bold" }}>payments</Icon>
            &nbsp;new payout
          </MDButton>
        </MDBox>
      </MDBox>
      <MDBox pt={1} pb={2} px={2}>
        <MDBox mb={2} px={1}>
          <Grid container sx={{ borderBottom: "1px solid #f0f2f5", pb: 1 }}>
            <Grid item xs={12} md={4}>
              <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
                Transaction Details
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={3}>
              <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
                Date & Time
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={3}>
              <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
                Linked Event
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={2} sx={{ textAlign: "right" }}>
              <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
                Amount
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox
          component="ul"
          display="flex"
          flexDirection="column"
          p={0}
          m={0}
          sx={{ 
            listStyle: "none",
            maxHeight: "450px",
            overflowY: "auto",
            "&::-webkit-scrollbar": { display: "none" }, // Chrome/Safari
            msOverflowStyle: "none", // IE/Edge
            scrollbarWidth: "none" // Firefox
          }}
        >
          {transactions.map((t) => {
            const isIncome = t.type === "income";
            const isPending = t.type === "pending";
            let color = isIncome ? "success" : "error";
            if (isPending) color = "dark";
            let icon = isIncome ? "expand_less" : "expand_more";
            if (isPending) icon = "priority_high";
            let prefix = isIncome ? "+ " : "- ";
            if (isPending) prefix = "";

            return (
              <Transaction
                key={t._id}
                color={color}
                icon={icon}
                name={t.name}
                description={t.description || `${new Date(t.date).toLocaleDateString()} at ${new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                value={isPending ? "Pending" : `${prefix}₹${t.amount.toLocaleString()}`}
                reason={t.relatedEvent ? `Event: ${t.relatedEvent.eventTitle}` : t.reason}
              />
            );
          })}
          {transactions.length === 0 && (
            <MDTypography variant="caption" color="text">No transactions found.</MDTypography>
          )}
        </MDBox>
      </MDBox>
    </Card>
  );
}

Transactions.propTypes = {
  transactions: PropTypes.arrayOf(PropTypes.object),
  onNewPayout: PropTypes.func
};

export default Transactions;
