/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

// @mui material components
import Tooltip from "@mui/material/Tooltip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";
import API_BASE_URL from "apiConfig";

// Images
import logoXD from "assets/images/small-logos/logo-xd.svg";
import logoAtlassian from "assets/images/small-logos/logo-atlassian.svg";
import logoSlack from "assets/images/small-logos/logo-slack.svg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import logoJira from "assets/images/small-logos/logo-jira.svg";
import logoInvesion from "assets/images/small-logos/logo-invision.svg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

export default function data(recentEvents = []) {
  const avatars = (members) =>
    members.map(({ image, name }) => {
      const isExternal = image && image.startsWith("http");
      const avatarSrc = image ? (isExternal ? image : `${API_BASE_URL}/uploads/${image}`) : team1;
      
      return (
        <Tooltip key={name} title={name} placeholder="bottom">
          <MDAvatar
            src={avatarSrc}
            alt={name}
            size="xs"
            sx={{
              border: ({ borders: { borderWidth }, palette: { white } }) =>
                `${borderWidth[2]} solid ${white.main}`,
              cursor: "pointer",
              position: "relative",
  
              "&:not(:first-of-type)": {
                ml: -1.25,
              },
  
              "&:hover, &:focus": {
                zIndex: "10",
              },
            }}
          />
        </Tooltip>
      );
    });

  const Company = ({ name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDTypography variant="button" fontWeight="medium" lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  const rows = recentEvents.map((event) => ({
    event: <Company name={event.title} />,
    members: (
      <MDBox display="flex" py={1}>
        {avatars(event.speakers || [])}
      </MDBox>
    ),
    date: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {event.date}
      </MDTypography>
    ),
    revenue: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {event.revenue}
      </MDTypography>
    ),
    status: (
      <MDBox width="8rem" textAlign="left">
        <MDProgress value={event.progress} color={event.progress > 80 ? "success" : "info"} variant="gradient" label={false} />
      </MDBox>
    ),
  }));

  return {
    columns: [
      { Header: "event", accessor: "event", width: "45%", align: "left" },
      { Header: "speakers", accessor: "members", width: "10%", align: "left" },
      { Header: "date", accessor: "date", width: "10%", align: "center" },
      { Header: "revenue", accessor: "revenue", align: "center" },
      { Header: "tickets sold", accessor: "status", align: "center" },
    ],
    rows: rows.length > 0 ? rows : [
      {
        event: <Company name="Corporate Gala Dinner" />,
        members: (
          <MDBox display="flex" py={1}>
            {avatars([{ image: team1, name: "Ryan Tompson" }, { image: team2, name: "Romina Hadid" }])}
          </MDBox>
        ),
        date: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            25 Dec 2025
          </MDTypography>
        ),
        revenue: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            ₹14,000
          </MDTypography>
        ),
        status: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress value={60} color="info" variant="gradient" label={false} />
          </MDBox>
        ),
      }
    ],
  };
}

