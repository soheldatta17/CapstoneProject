

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// EventZen React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";

function Invoice({ date, id, price, status, noGutter }) {
  return (
    <MDBox
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      py={1}
      pr={1}
      mb={noGutter ? 0 : 1}
    >
      <MDBox lineHeight={1.125}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {date}
        </MDTypography>
        <MDBox display="flex" alignItems="center" mt={0.5}>
          <MDTypography variant="caption" fontWeight="regular" color="text" mr={1}>
            {id}
          </MDTypography>
          <MDBadge 
            variant="contained" 
            color={status === "Paid" ? "success" : "secondary"} 
            size="xs" 
            badgeContent={status || "Paid"} 
            container 
          />
        </MDBox>
      </MDBox>
      <MDBox display="flex" alignItems="center">
        <MDTypography variant="button" fontWeight="medium" color="text">
          {price}
        </MDTypography>
        <MDBox 
          display="flex" 
          alignItems="center" 
          lineHeight={1} 
          ml={3} 
          sx={{ cursor: "pointer", "&:hover": { color: "info.main" } }}
        >
          <Icon fontSize="small" color="inherit">picture_as_pdf</Icon>
          <MDTypography variant="button" fontWeight="bold" color="inherit">
            &nbsp;PDF
          </MDTypography>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

// Setting default values for the props of Invoice
Invoice.defaultProps = {
  noGutter: false,
};

// Typechecking props for the Invoice
Invoice.propTypes = {
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  status: PropTypes.string,
  noGutter: PropTypes.bool,
};

export default Invoice;
