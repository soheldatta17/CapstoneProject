import { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate, useParams } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";

dayjs.extend(relativeTime);

// EventZen React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// EventZen React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import PieChart from "examples/Charts/PieChart";

import API_BASE_URL from "apiConfig";

const API_BASE = API_BASE_URL;

function formatEventDate(value) {
  if (!value) return "Date & Time not set";
  return dayjs(value).isValid() ? dayjs(value).format("ddd, MMM D YYYY - h:mm A") : String(value);
}

function StatCard({ label, value, color = "inherit", subtitle }) {
  return (
    <Card sx={{ border: "1px solid", borderColor: "divider", boxShadow: "none", height: "100%" }}>
      <MDBox p={2.5}>
        <MDTypography variant="button" color="text" display="block" mb={0.5}>
          {label}
        </MDTypography>
        <MDTypography variant="h3" fontWeight="bold" color={color}>
          {value}
        </MDTypography>
        {subtitle && (
          <MDTypography variant="caption" color="text">
            {subtitle}
          </MDTypography>
        )}
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of StatCard
StatCard.defaultProps = {
  color: "inherit",
  subtitle: "",
};

// Typechecking props for the StatCard
StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string,
  subtitle: PropTypes.string,
};

function getAvatarPath(path, baseUrl) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  // If path already contains uploads, don't duplicate
  if (cleanPath.startsWith("/uploads/")) return `${baseUrl}${cleanPath}`;
  return `${baseUrl}/uploads${cleanPath}`;
}

function EventDetails() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [tab, setTab] = useState(0);

  // Event data
  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);

  // Comments
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [commentAuthor] = useState(() => {
    const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.fullName || "Admin";
      } catch (e) {
        return "Admin";
      }
    }
    return "Admin";
  });

  const adminAvatar = useMemo(() => {
    const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.avatar || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  }, []);

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
  const [postingComment, setPostingComment] = useState(false);

  // Registrations
  const [regData, setRegData] = useState({ total: 0, checkedIn: 0, breakdown: {}, registrations: [] });
  const [loadingReg, setLoadingReg] = useState(false);

  // Analytics
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Memoized Chart Data
  const ticketChartData = useMemo(() => {
    if (!analytics || !analytics.ticketBreakdown) return { labels: [], datasets: { data: [] } };
    return {
      labels: Object.keys(analytics.ticketBreakdown).filter((k) => analytics.ticketBreakdown[k] > 0),
      datasets: {
        label: "Tickets",
        backgroundColors: ["info", "primary", "dark", "success", "warning"],
        data: Object.values(analytics.ticketBreakdown).filter((v) => v > 0),
      },
    };
  }, [analytics?.ticketBreakdown]);

  // Snackbar
  const [snack, setSnack] = useState({ open: false, severity: "success", message: "" });

  // Fetch event
  useEffect(() => {
    if (!eventId) return;
    setLoadingEvent(true);
    fetch(`${API_BASE}/api/events/${eventId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setEvent(null);
        else setEvent(data);
      })
      .catch(() => setEvent(null))
      .finally(() => setLoadingEvent(false));
  }, [eventId]);

  // Fetch comments
  const fetchComments = useCallback(() => {
    if (!eventId) return;
    fetch(`${API_BASE}/api/events/${eventId}/comments`)
      .then((r) => r.json())
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch(() => setComments([]));
  }, [eventId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Fetch registrations when tab = 0
  const fetchRegistrations = useCallback(async () => {
    if (!eventId) return;
    setLoadingReg(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/events/${eventId}/registrations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setRegData(data);
    } catch (err) {
      console.error("Failed to fetch registrations", err);
    } finally {
      setLoadingReg(false);
    }
  }, [eventId]);

  // Fetch analytics when tab = 1
  const fetchAnalytics = useCallback(async () => {
    if (!eventId) return;
    setLoadingAnalytics(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/events/${eventId}/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setAnalytics(data);
    } catch (err) {
      console.error("Failed to fetch analytics", err);
    } finally {
      setLoadingAnalytics(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (tab === 0) fetchRegistrations();
    if (tab === 1) fetchAnalytics();
  }, [tab, fetchRegistrations, fetchAnalytics]);

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;
    setPostingComment(true);
    try {
      const res = await fetch(`${API_BASE}/api/events/${eventId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          author: commentAuthor, 
          text: commentInput.trim(),
          userId: adminId,
          avatar: adminAvatar
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post comment.");
      setComments((prev) => [data, ...prev]);
      setCommentInput("");
      setSnack({ open: true, severity: "success", message: "Comment posted!" });
    } catch (err) {
      setSnack({ open: true, severity: "error", message: err.message });
    } finally {
      setPostingComment(false);
    }
  };

  const coverSrc = (ev) => {
    if (!ev?.coverImage) return null;
    if (ev.coverImage.startsWith("/uploads")) return `${API_BASE}${ev.coverImage}`;
    return ev.coverImage;
  };

  // ── Loading state ──
  if (loadingEvent) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3}>
          <Card sx={{ overflow: "hidden" }}>
            <Skeleton variant="rectangular" width="100%" height={320} />
            <MDBox p={3}>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
              <Grid container spacing={3} mt={1}>
                <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={200} /></Grid>
                <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={200} /></Grid>
              </Grid>
            </MDBox>
          </Card>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  // ── Not found ──
  if (!event) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3}>
          <Card>
            <MDBox p={3}>
              <MDTypography variant="h5" fontWeight="bold" mb={1}>Event not found</MDTypography>
              <MDTypography variant="button" color="text" mb={2} display="block">
                The selected event does not exist or was removed.
              </MDTypography>
              <MDButton variant="gradient" color="info" onClick={() => navigate("/events")}>
                Back to Events
              </MDButton>
            </MDBox>
          </Card>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  const cover = coverSrc(event);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Card sx={{ overflow: "hidden" }}>

          {/* ── Hero Banner ── */}
          <MDBox position="relative" height={{ xs: 230, md: 320 }} sx={{ bgcolor: "#101214" }}>
            {cover ? (
              <MDBox
                component="img"
                src={cover}
                alt={event.eventTitle}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <MDBox
                sx={{
                  width: "100%", height: "100%",
                  background: "linear-gradient(135deg, #1a237e, #0d47a1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Icon sx={{ fontSize: "5rem !important", color: "rgba(255,255,255,0.15)" }}>event</Icon>
              </MDBox>
            )}
            <MDBox
              sx={{
                position: "absolute", inset: 0,
                background: "linear-gradient(180deg, rgba(9,16,26,0.2) 25%, rgba(9,16,26,0.86) 90%)",
              }}
            />

            <MDBox position="absolute" left={24} right={24} bottom={18}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1.5}>
                <MDBox>
                  <MDTypography variant="h3" color="white" fontWeight="bold">
                    {event.eventTitle}
                  </MDTypography>
                  <MDBox mt={0.6} display="flex" flexWrap="wrap" gap={2}>
                    <MDBox display="flex" alignItems="center" gap={0.5}>
                      <Icon sx={{ color: "#fff" }}>calendar_month</Icon>
                      <MDTypography variant="button" color="white">
                        {formatEventDate(event.eventDate)}
                      </MDTypography>
                    </MDBox>
                    {event.location?.title && (
                      <MDBox display="flex" alignItems="center" gap={0.5}>
                        <Icon sx={{ color: "#fff" }}>location_on</Icon>
                        <MDTypography variant="button" color="white">
                          {event.location.title}
                          {event.location.address ? ` - ${event.location.address}` : ""}
                        </MDTypography>
                      </MDBox>
                    )}
                  </MDBox>
                </MDBox>
                <Chip
                  label={`${regData.total} Registered`}
                  color="info"
                  sx={{ color: "white", fontWeight: 700, fontSize: "0.8rem" }}
                />
              </Stack>
            </MDBox>
          </MDBox>

          {/* ── Event Body ── */}
          <MDBox p={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card sx={{ border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
                  <MDBox p={2.5}>
                    <MDTypography variant="h6" fontWeight="medium" mb={1}>Event Summary</MDTypography>
                    {event.description ? (
                      <MDBox
                        sx={{
                          "& h1,& h2,& h3,& h4,& h5,& h6": { margin: 0, marginBottom: 1, color: "text.primary" },
                          "& p": { margin: 0, marginBottom: 1.2, color: "text.secondary", lineHeight: 1.8, fontSize: "0.95rem" },
                          "& ul,& ol": { margin: 0, paddingLeft: "1.2rem", color: "text.secondary" },
                          "& li": { marginBottom: 0.5, lineHeight: 1.7 },
                        }}
                        dangerouslySetInnerHTML={{ __html: event.description }}
                      />
                    ) : (
                      <MDTypography variant="button" color="text">No description added.</MDTypography>
                    )}
                  </MDBox>
                </Card>
              </Grid>

              {/* Speakers */}
              {event.speakers?.length > 0 && (
                <Grid item xs={12} md={6}>
                  <Card sx={{ border: "1px solid", borderColor: "divider", boxShadow: "none", height: "100%" }}>
                    <MDBox px={2} py={1.5}>
                      <MDTypography variant="h6" fontWeight="medium">
                        Speakers ({event.speakers.length})
                      </MDTypography>
                    </MDBox>
                    <Divider />
                    <MDBox p={2}>
                      <Stack spacing={1.2}>
                        {event.speakers.map((speaker, i) => (
                          <MDBox key={speaker._id || i} display="flex" alignItems="center">
                            <Avatar src={speaker.image} alt={speaker.name} sx={{ width: 40, height: 40 }} />
                            <MDBox ml={1.2}>
                              <MDTypography variant="button" fontWeight="medium" display="block">
                                {speaker.name}
                              </MDTypography>
                              <MDTypography variant="caption" color="text">
                                {speaker.role || "Guest Speaker"}
                              </MDTypography>
                            </MDBox>
                          </MDBox>
                        ))}
                      </Stack>
                    </MDBox>
                  </Card>
                </Grid>
              )}

              {/* Promo Video */}
              <Grid item xs={12} md={event.speakers?.length > 0 ? 6 : 12}>
                <Card sx={{ border: "1px solid", borderColor: "divider", boxShadow: "none", height: "100%" }}>
                  <MDBox p={2}>
                    {event.promoVideo ? (
                      <MDBox
                        component="video"
                        src={event.promoVideo.startsWith("/uploads") ? `${API_BASE}${event.promoVideo}` : event.promoVideo}
                        controls
                        sx={{ width: "100%", borderRadius: "10px", bgcolor: "#000", maxHeight: 340 }}
                      />
                    ) : (
                      <MDBox
                        sx={{ height: 220, borderRadius: "10px", bgcolor: "grey.100", display: "grid", placeItems: "center" }}
                      >
                        <MDTypography variant="caption" color="text">No promotional video uploaded</MDTypography>
                      </MDBox>
                    )}
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>

          <MDBox px={2} pt={0.5}>
            <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
              <Tab label={loadingReg ? "Registrations" : `Registrations (${regData.total})`} />
              <Tab label="Analytics" />
              <Tab label={`Comments (${comments.length})`} />
            </Tabs>
          </MDBox>
          <Divider />

          {/* ── Tab Panels ── */}
          <MDBox p={3}>
            {/* ── Registrations Tab ── */}
            {tab === 0 && (
              <Grid container spacing={3}>
                {loadingReg ? (
                  <Grid item xs={12}>
                    <Skeleton variant="rectangular" height={200} />
                  </Grid>
                ) : (
                  <>
                    <Grid item xs={12} md={4}>
                      <StatCard label="Total Registrations" value={regData.total} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <StatCard label="Checked In" value={regData.checkedIn} color="success" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <StatCard
                        label="Attendance Ratio"
                        value={regData.total > 0 ? `${Math.round((regData.checkedIn / regData.total) * 100)}%` : "—"}
                        color="info"
                      />
                    </Grid>



                    {/* Registrations table */}
                    <Grid item xs={12}>
                      <Card sx={{ border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
                        <MDBox pt={1}>
                          {regData.registrations.length === 0 ? (
                            <MDBox py={5} textAlign="center">
                              <Icon sx={{ fontSize: "2.5rem !important", opacity: 0.25 }}>group_off</Icon>
                              <MDTypography variant="button" color="text" display="block" mt={1}>
                                No registrations yet.
                              </MDTypography>
                            </MDBox>
                          ) : (
                            <DataTable
                              table={{
                                columns: [
                                  { Header: "#", accessor: "index", width: "5%", align: "left" },
                                  { Header: "name", accessor: "name", align: "left" },
                                  { Header: "email", accessor: "email", align: "left" },
                                  { Header: "ticket", accessor: "ticket", align: "center" },
                                  { Header: "checked in", accessor: "checkedIn", align: "center" },
                                  { Header: "registered", accessor: "registered", align: "center" },
                                ],
                                rows: regData.registrations.map((entry, idx) => ({
                                  index: (
                                    <MDTypography variant="caption" color="text" fontWeight="medium">
                                      {idx + 1}
                                    </MDTypography>
                                  ),
                                  name: (
                                    <MDBox display="flex" alignItems="center" lineHeight={1}>
                                      <MDAvatar
                                        src={getAvatarPath(entry.avatar, API_BASE)}
                                        sx={{ bgcolor: `hsl(${(entry.name?.charCodeAt(0) || 0) * 40 % 360}, 55%, 45%)` }}
                                        size="sm"
                                        name={entry.name}
                                      >
                                        {!entry.avatar && entry.name?.charAt(0).toUpperCase()}
                                      </MDAvatar>
                                      <MDBox ml={2} lineHeight={1}>
                                        <MDTypography display="block" variant="button" fontWeight="medium">
                                          {entry.name}
                                        </MDTypography>
                                      </MDBox>
                                    </MDBox>
                                  ),
                                  email: (
                                    <MDTypography variant="caption" color="text" fontWeight="medium">
                                      {entry.email}
                                    </MDTypography>
                                  ),
                                  ticket: (
                                    <MDBadge
                                      badgeContent={entry.ticketType}
                                      color={entry.ticketType === "VIP" ? "warning" : entry.ticketType === "Premium" ? "info" : entry.ticketType === "Sponsor" ? "success" : "secondary"}
                                      variant="gradient"
                                      size="sm"
                                    />
                                  ),
                                  checkedIn: (
                                    <MDBadge
                                      badgeContent={entry.checkedIn ? "Yes" : "No"}
                                      color={entry.checkedIn ? "success" : "secondary"}
                                      variant="gradient"
                                      size="sm"
                                    />
                                  ),
                                  registered: (
                                    <MDTypography variant="caption" color="text" fontWeight="medium">
                                      {dayjs(entry.createdAt).format("MMM D, YYYY")}
                                    </MDTypography>
                                  ),
                                })),
                              }}
                              isSorted={false}
                              entriesPerPage={false}
                              showTotalEntries={false}
                              noEndBorder
                            />
                          )}
                        </MDBox>
                      </Card>
                    </Grid>
                  </>
                )}
              </Grid>
            )}

            {/* ── Analytics Tab ── */}
            {tab === 1 && (
              <Grid container spacing={3}>
                {loadingAnalytics || !analytics ? (
                  <>
                    {[0, 1, 2].map((i) => (
                      <Grid key={i} item xs={12} md={4}>
                        <Skeleton variant="rectangular" height={90} />
                      </Grid>
                    ))}
                  </>
                ) : (
                  <>
                    <Grid item xs={12} md={4}>
                      <StatCard label="Page Views (est.)" value={analytics.pageViews.toLocaleString()} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <StatCard label="Registration Conversion" value={`${analytics.conversion}%`} color="success" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <StatCard label="Video Engagement" value={analytics.videoEngagement} color="info" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <StatCard label="Total Registrations" value={analytics.registrationCount} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <StatCard
                        label="Checked In"
                        value={analytics.checkedIn}
                        color="success"
                        subtitle={`Attendance ratio: ${analytics.attendanceRatio}%`}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <StatCard label="Total Comments" value={analytics.commentCount} color="info" />
                    </Grid>

                    {/* Ticket breakdown - Pie Chart */}
                    {analytics.ticketBreakdown && (
                      <Grid item xs={12}>
                        <Card sx={{ border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
                          <MDBox px={2} py={2} display="flex" justifyContent="space-between" alignItems="center">
                            <MDBox>
                              <MDTypography variant="h6" fontWeight="medium">Ticket Distribution</MDTypography>
                              <MDTypography variant="button" color="text">Breakdown by category</MDTypography>
                            </MDBox>
                            <Icon color="info" fontSize="medium">pie_chart</Icon>
                          </MDBox>
                          <Divider />
                          <MDBox p={2}>
                            <PieChart
                              height="20rem"
                              chart={ticketChartData}
                            />
                          </MDBox>
                        </Card>
                      </Grid>
                    )}
                  </>
                )}
              </Grid>
            )}

            {/* ── Comments Tab ── */}
            {tab === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card sx={{ boxShadow: "none", border: "1px solid", borderColor: "divider" }}>
                    {/* Add Comment Input (YouTube Style) */}
                    <MDBox p={3}>
                      <MDBox display="flex" alignItems="flex-start" gap={2}>
                        <MDAvatar
                          src={getAvatarPath(adminAvatar, API_BASE) || undefined}
                          sx={adminAvatar ? {} : { bgcolor: "info.main", width: 40, height: 40 }}
                          size="sm"
                        >
                          {!adminAvatar && commentAuthor.charAt(0).toUpperCase()}
                        </MDAvatar>
                        <MDBox flex={1}>
                          <TextField
                            fullWidth
                            multiline
                            placeholder="Add a comment..."
                            variant="standard"
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            sx={{
                              "& .MuiInput-root": { fontSize: "0.875rem" },
                              mb: 1
                            }}
                          />
                          <MDBox display="flex" justifyContent="flex-end" gap={1}>
                            <MDButton
                              variant="text"
                              color="secondary"
                              size="small"
                              onClick={() => setCommentInput("")}
                              disabled={!commentInput.trim()}
                            >
                              Cancel
                            </MDButton>
                            <MDButton
                              variant="gradient"
                              color="info"
                              size="small"
                              onClick={handleAddComment}
                              disabled={postingComment || !commentInput.trim()}
                            >
                              {postingComment ? <CircularProgress size={16} color="inherit" /> : "Comment"}
                            </MDButton>
                          </MDBox>
                        </MDBox>
                      </MDBox>
                    </MDBox>

                    <Divider />

                    {/* Scrollable Comment List */}
                    <MDBox
                      p={2}
                      sx={{
                        maxHeight: "500px", // Fixed height for scrollability
                        overflowY: "auto",
                        "&::-webkit-scrollbar": { width: "5px" },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "#e0e0e0",
                          borderRadius: "10px"
                        }
                      }}
                    >
                      {comments.length === 0 ? (
                        <MDBox py={4} textAlign="center">
                          <Icon sx={{ fontSize: "2rem !important", opacity: 0.3 }}>chat_bubble_outline</Icon>
                          <MDTypography variant="button" color="text" display="block" mt={1}>
                            No comments yet. Be the first to comment!
                          </MDTypography>
                        </MDBox>
                      ) : (
                        <List sx={{ py: 0 }}>
                          {[...comments].reverse().map((comment, idx) => (
                            <MDBox key={comment._id || idx} mb={3}>
                              <ListItem alignItems="flex-start" sx={{ px: 0, py: 0 }}>
                                <ListItemAvatar sx={{ minWidth: 50, mt: 0.5 }}>
                                  <MDAvatar
                                    src={getAvatarPath(comment.avatar, API_BASE) || undefined}
                                    sx={comment.avatar ? { width: 35, height: 35 } : {
                                      bgcolor: `hsl(${(comment.author?.charCodeAt(0) || 0) * 40 % 360}, 55%, 45%)`,
                                      width: 35,
                                      height: 35
                                    }}
                                    size="sm"
                                  >
                                    {!comment.avatar && (comment.author || "A").charAt(0).toUpperCase()}
                                  </MDAvatar>
                                </ListItemAvatar>
                                <ListItemText
                                  sx={{ m: 0 }}
                                  primary={
                                    <MDBox display="flex" alignItems="center" gap={1} mb={0.5}>
                                      <MDTypography variant="button" fontWeight="bold" sx={{ fontSize: "0.85rem" }}>
                                        @{comment.author?.toLowerCase().replace(/\s/g, '') || "user"}
                                      </MDTypography>
                                      <MDTypography variant="caption" color="text">
                                        {dayjs(comment.createdAt).fromNow()}
                                      </MDTypography>
                                    </MDBox>
                                  }
                                  secondary={
                                    <MDTypography variant="button" color="text" sx={{ display: "block", lineHeight: 1.5, fontSize: "0.9rem" }}>
                                      {comment.text}
                                    </MDTypography>
                                  }
                                />
                              </ListItem>
                            </MDBox>
                          ))}
                        </List>
                      )}
                    </MDBox>
                  </Card>
                </Grid>
              </Grid>
            )}
          </MDBox>
        </Card>

        <MDBox mt={2} display="flex" justifyContent="flex-end">
          <MDButton variant="outlined" color="secondary" onClick={() => navigate("/events")}>
            Back
          </MDButton>
        </MDBox>
      </MDBox>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>

      <Footer />
    </DashboardLayout>
  );
}

export default EventDetails;
