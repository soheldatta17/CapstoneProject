import { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// EventZen React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// EventZen React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import API_BASE_URL from "apiConfig";

const API_BASE = API_BASE_URL;

function stripHtml(value) {
  if (!value) return "";
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function formatEventDate(value) {
  if (!value) return "Date & Time not set";
  return dayjs(value).isValid() ? dayjs(value).format("ddd, MMM D YYYY - h:mm A") : String(value);
}

function EventCardSkeleton() {
  return (
    <Grid item xs={12} md={6} xl={4}>
      <Card sx={{ borderRadius: "xl", overflow: "hidden" }}>
        <Skeleton variant="rectangular" width="100%" height={220} />
        <MDBox p={2.5}>
          <Skeleton variant="text" width="70%" height={28} />
          <Skeleton variant="text" width="50%" height={20} sx={{ mt: 0.5 }} />
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="100%" height={20} sx={{ mt: 1 }} />
          <Skeleton variant="text" width="90%" height={20} />
          <Stack direction="row" spacing={-0.5} mt={2}>
            <Skeleton variant="circular" width={34} height={34} />
            <Skeleton variant="circular" width={34} height={34} />
            <Skeleton variant="circular" width={34} height={34} />
          </Stack>
        </MDBox>
      </Card>
    </Grid>
  );
}

function Tables() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [tabValue, setTabValue] = useState(0);

  const adminId = useMemo(() => {
    const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.id || user._id || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  }, []);

  const filteredEvents = useMemo(() => {
    if (tabValue === 1) return events; // All Events
    return events.filter(event => {
      if (!event.createdBy) return false;
      const createdById = typeof event.createdBy === 'string' 
        ? event.createdBy 
        : (event.createdBy.$oid || event.createdBy._id);
      return createdById === adminId;
    });
  }, [events, tabValue, adminId]);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/events`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to load events.");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshCount]);

  const coverSrc = (event) => {
    if (!event.coverImage) return null;
    if (event.coverImage.startsWith("/uploads")) return `${API_BASE}${event.coverImage}`;
    return event.coverImage;
  };

  const videoSrc = (event) => {
    if (!event.promoVideo) return null;
    if (event.promoVideo.startsWith("/uploads")) return `${API_BASE}${event.promoVideo}`;
    return event.promoVideo;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3} px={2}>
          <MDTypography variant="h4" fontWeight="bold">EventZen</MDTypography>
          <Tooltip title="Refresh Events">
            <IconButton 
              color="info" 
              onClick={() => { setLoading(true); setError(null); setRefreshCount(c => c + 1); }}
              sx={{ bgcolor: "white", boxShadow: 1, "&:hover": { bgcolor: "#f8f9fa" } }}
            >
              <Icon>refresh</Icon>
            </IconButton>
          </Tooltip>
        </MDBox>
        <MDBox px={2} pt={0.5} mb={3}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="scrollable" scrollButtons="auto">
            <Tab label="My Events" />
            <Tab label="All Events" />
          </Tabs>
        </MDBox>
        <Grid container spacing={3}>
          {loading && [0, 1, 2, 3, 4, 5].map((i) => <EventCardSkeleton key={i} />)}

          {!loading && error && (
            <Grid item xs={12}>
              <MDBox textAlign="center" py={8}>
                <Icon sx={{ fontSize: "3rem !important", color: "error.main" }}>error_outline</Icon>
                <MDTypography variant="h6" color="error" mt={1}>
                  {error}
                </MDTypography>
              </MDBox>
            </Grid>
          )}

          {!loading && !error && filteredEvents.length === 0 && (
            <Grid item xs={12}>
              <MDBox textAlign="center" py={8}>
                <Icon sx={{ fontSize: "3rem !important", opacity: 0.3 }}>event_busy</Icon>
                <MDTypography variant="h6" color="text" mt={1}>
                  No events found in this category.
                </MDTypography>
              </MDBox>
            </Grid>
          )}

          {!loading &&
            !error &&
            filteredEvents.map((event, index) => (
              <Grid item xs={12} md={6} xl={4} key={event._id}>
                <Card
                  onClick={() => navigate(`/events/${event._id}`)}
                  sx={{
                    cursor: "pointer",
                    height: "100%",
                    borderRadius: "xl",
                    overflow: "hidden",
                    transition: "all 250ms ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: (theme) => theme.boxShadows.xl,
                    },
                    "&:hover .event-cover": {
                      transform: event.promoVideo ? "scale(1.03)" : "scale(1.08)",
                    },
                    "&:hover .event-video": { opacity: 1 },
                  }}
                >
                  <MDBox position="relative" height="220px" sx={{ bgcolor: "#111" }}>
                    {coverSrc(event) ? (
                      <MDBox
                        component="img"
                        src={coverSrc(event)}
                        alt={event.eventTitle}
                        className="event-cover"
                        sx={{
                          width: "100%", height: "100%", objectFit: "cover",
                          transition: "transform 350ms ease",
                        }}
                      />
                    ) : (
                      <MDBox
                        className="event-cover"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        height="100%"
                        sx={{
                          background: `linear-gradient(135deg, hsl(${(index * 47) % 360},60%,35%), hsl(${(index * 47 + 40) % 360},50%,25%))`,
                          transition: "transform 350ms ease",
                        }}
                      >
                        <Icon sx={{ fontSize: "3.5rem !important", color: "rgba(255,255,255,0.25)" }}>
                          event
                        </Icon>
                      </MDBox>
                    )}

                    {event.promoVideo && (
                      <MDBox
                        component="video"
                        className="event-video"
                        src={videoSrc(event)}
                        muted
                        loop
                        autoPlay
                        playsInline
                        sx={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          opacity: 0,
                          transition: "opacity 300ms ease",
                        }}
                      />
                    )}
                  </MDBox>

                  <MDBox p={2.5}>
                    <MDTypography variant="h6" fontWeight="bold" mb={0.5}>
                      {event.eventTitle || "Untitled Event"}
                    </MDTypography>

                    <Stack direction="row" alignItems="center" spacing={1} mb={0.8}>
                      <Icon fontSize="small" color="info">calendar_month</Icon>
                      <MDTypography variant="caption" color="text">
                        {formatEventDate(event.eventDate)}
                      </MDTypography>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                      <Icon fontSize="small" color="info">location_on</Icon>
                      <MDTypography variant="caption" color="text">
                        {event.location?.title || "Location not set"}
                        {event.location?.address ? ` - ${event.location.address}` : ""}
                      </MDTypography>
                    </Stack>

                    <MDTypography
                      variant="button"
                      color="text"
                      sx={{
                        display: "-webkit-box",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        minHeight: "2.4em",
                      }}
                    >
                      {stripHtml(event.description)}
                    </MDTypography>

                    <Divider sx={{ my: 1.5 }} />

                    <Stack direction="row" spacing={-0.7}>
                      {(event.speakers || []).map((speaker, i) => (
                        <Tooltip
                          key={speaker._id || i}
                          title={`${speaker.name} - ${speaker.role || "Guest Speaker"}`}
                        >
                          <Avatar
                            src={speaker.image}
                            alt={speaker.name}
                            sx={{ width: 34, height: 34, border: "2px solid", borderColor: "white" }}
                          />
                        </Tooltip>
                      ))}
                      {(event.speakers || []).length === 0 && (
                        <MDTypography variant="caption" color="text">No speakers</MDTypography>
                      )}
                    </Stack>
                  </MDBox>
                </Card>
              </Grid>
            ))}
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
