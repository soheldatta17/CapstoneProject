// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";

// EventZen React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Images
import masterCardLogo from "assets/images/logos/mastercard.png";
import visaLogo from "assets/images/logos/visa.png";

// EventZen React context
import { useMaterialUIController } from "context";

function PaymentMethod({ methods = [] }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // Filter out the default card because it's usually shown at the top
  const payoutMethods = methods.filter(m => !m.isDefault);

  return (
    <Card id="delete-account">
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Payout Methods
        </MDTypography>
        <MDButton variant="gradient" color="dark">
          <Icon sx={{ fontWeight: "bold" }}>add</Icon>
          &nbsp;add payout card
        </MDButton>
      </MDBox>
      <MDBox p={2}>
        <Grid container spacing={3}>
          {payoutMethods.map((m, index) => (
            <Grid item xs={12} md={6} key={m._id || index}>
              <MDBox
                borderRadius="lg"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={3}
                sx={{
                  border: ({ borders: { borderWidth, borderColor } }) =>
                    `${borderWidth[1]} solid ${borderColor}`,
                }}
              >
                <MDBox 
                  component="img" 
                  src={m.type === "mastercard" ? masterCardLogo : visaLogo} 
                  alt={m.type} 
                  width="10%" 
                  mr={2} 
                />
                <MDTypography variant="h6" fontWeight="medium">
                  ****&nbsp;&nbsp;****&nbsp;&nbsp;****&nbsp;&nbsp;{m.last4}
                </MDTypography>
                <MDBox ml="auto" lineHeight={0} color={darkMode ? "white" : "dark"}>
                  <Tooltip title="Edit Method" placement="top">
                    <Icon sx={{ cursor: "pointer" }} fontSize="small">
                      edit
                    </Icon>
                  </Tooltip>
                </MDBox>
              </MDBox>
            </Grid>
          ))}
          {payoutMethods.length === 0 && (
            <MDBox p={3}>
              <MDTypography variant="caption" color="text">No other payout methods found.</MDTypography>
            </MDBox>
          )}
        </Grid>
      </MDBox>
    </Card>
  );
}

PaymentMethod.propTypes = {
  methods: PropTypes.arrayOf(PropTypes.object),
};

export default PaymentMethod;
