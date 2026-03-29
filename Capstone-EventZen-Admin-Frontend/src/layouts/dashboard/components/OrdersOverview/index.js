

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// EventZen React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// EventZen React example components
import TimelineItem from "examples/Timeline/TimelineItem";

import PropTypes from "prop-types";

function OrdersOverview({ timeline = [] }) {
  const renderTimelineItems = timeline.map((item, index) => (
    <TimelineItem
      key={index}
      color={item.color}
      icon={item.icon}
      title={item.title}
      dateTime={item.dateTime}
      lastItem={item.lastItem || index === timeline.length - 1}
    />
  ));

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Event Timeline
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            <MDTypography display="inline" variant="body2" verticalAlign="middle">
              <Icon sx={{ color: ({ palette: { success } }) => success.main }}>arrow_upward</Icon>
            </MDTypography>
            &nbsp;
            <MDTypography variant="button" color="text" fontWeight="medium">
              Live updates
            </MDTypography>{" "}
            from system
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox p={2}>
        {renderTimelineItems.length > 0 ? renderTimelineItems : (
          <MDTypography variant="button" color="text" fontWeight="regular">
            No recent activity found.
          </MDTypography>
        )}
      </MDBox>
    </Card>
  );
}

OrdersOverview.propTypes = {
  timeline: PropTypes.array
};

export default OrdersOverview;
