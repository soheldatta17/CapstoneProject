import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Skeleton from "@mui/material/Skeleton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";

// EventZen React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import API_BASE_URL from "apiConfig";

const API_BASE = `${API_BASE_URL}/api`;
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function CalendarPage() {
  const navigate = useNavigate();
  const [today] = useState(() => dayjs());
  const [currentDate, setCurrentDate] = useState(() => dayjs());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/events/calendar`)
      .then((r) => r.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  // Build a map of date-string → events
  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach((ev) => {
      if (!ev.eventDate) return;
      const key = dayjs(ev.eventDate).format("YYYY-MM-DD");
      if (!map[key]) map[key] = [];
      map[key].push(ev);
    });
    return map;
  }, [events]);

  // Calendar grid
  const { startDay, totalDays } = useMemo(() => {
    const startOfMonth = currentDate.startOf("month");
    return {
      startDay: startOfMonth.day(), // 0 = Sunday
      totalDays: currentDate.daysInMonth(),
    };
  }, [currentDate]);

  const handleDayClick = (day) => {
    const key = currentDate.date(day).format("YYYY-MM-DD");
    setSelectedDate({ day, key, label: currentDate.date(day).format("ddd, MMM D, YYYY") });
    setDialogOpen(true);
  };

  const selectedEvents = selectedDate ? eventsByDate[selectedDate.key] || [] : [];

  const prevMonth = () => setCurrentDate((d) => d.subtract(1, "month"));
  const nextMonth = () => setCurrentDate((d) => d.add(1, "month"));
  const goToday = () => setCurrentDate(dayjs());

  // Build grid cells
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={4} pb={3}>
        <Card>
          {/* ── Header ── */}
          <MDBox
            px={3}
            py={2}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            borderBottom="1px solid"
            sx={{ borderColor: "divider" }}
          >
            <MDBox display="flex" alignItems="center" gap={1}>
              <Icon color="info" sx={{ fontSize: "1.5rem !important" }}>calendar_month</Icon>
              <MDTypography variant="h5" fontWeight="bold">
                Event Calendar
              </MDTypography>
            </MDBox>
            <MDBox display="flex" alignItems="center" gap={1}>
              <MDButton variant="outlined" color="info" size="small" onClick={goToday}>
                Today
              </MDButton>
              <IconButton size="small" onClick={prevMonth}>
                <Icon>chevron_left</Icon>
              </IconButton>
              <MDTypography variant="h6" fontWeight="medium" sx={{ minWidth: "160px", textAlign: "center" }}>
                {currentDate.format("MMMM YYYY")}
              </MDTypography>
              <IconButton size="small" onClick={nextMonth}>
                <Icon>chevron_right</Icon>
              </IconButton>
            </MDBox>
          </MDBox>

          {/* ── Day Headers ── */}
          <MDBox
            display="grid"
            sx={{ gridTemplateColumns: "repeat(7, 1fr)", bgcolor: "grey.100" }}
          >
            {DAYS.map((d) => (
              <MDBox key={d} py={1} textAlign="center">
                <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                  {d}
                </MDTypography>
              </MDBox>
            ))}
          </MDBox>

          <Divider sx={{ m: 0 }} />

          {/* ── Calendar Grid ── */}
          {loading ? (
            <MDBox p={2}>
              <Skeleton variant="rectangular" height={400} />
            </MDBox>
          ) : (
            <MDBox
              display="grid"
              sx={{
                gridTemplateColumns: "repeat(7, 1fr)",
                gridAutoRows: "minmax(90px, auto)",
                "& > *": { borderRight: "1px solid", borderBottom: "1px solid", borderColor: "grey.200" },
              }}
            >
              {cells.map((day, idx) => {
                if (day === null) return <MDBox key={`empty-${idx}`} sx={{ bgcolor: "grey.50" }} />;

                const dateKey = currentDate.date(day).format("YYYY-MM-DD");
                const dayEvents = eventsByDate[dateKey] || [];
                const isToday = today.format("YYYY-MM-DD") === dateKey;

                return (
                  <MDBox
                    key={dateKey}
                    p={0.75}
                    onClick={() => handleDayClick(day)}
                    sx={{
                      cursor: dayEvents.length > 0 ? "pointer" : "default",
                      transition: "background 0.15s",
                      "&:hover": { bgcolor: "info.light", opacity: 0.85 },
                      position: "relative",
                    }}
                  >
                    {/* Day number */}
                    <MDBox
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        bgcolor: isToday ? "info.main" : "transparent",
                        mb: 0.5,
                      }}
                    >
                      <MDTypography
                        variant="caption"
                        fontWeight={isToday ? "bold" : "regular"}
                        color={isToday ? "white" : "text"}
                      >
                        {day}
                      </MDTypography>
                    </MDBox>

                    {/* Event chips */}
                    <MDBox display="flex" flexDirection="column" gap={0.25}>
                      {dayEvents.slice(0, 2).map((ev) => (
                        <Tooltip key={ev._id} title={ev.eventTitle} placement="top">
                          <Chip
                            label={
                              <span style={{ fontSize: "0.68rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 80 }}>
                                {dayjs(ev.eventDate).format("h:mm A")} {ev.eventTitle}
                              </span>
                            }
                            size="small"
                            color="info"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/events/${ev._id}`);
                            }}
                            sx={{
                              height: 18,
                              "& .MuiChip-label": { px: 0.75 },
                              fontSize: "0.65rem",
                              maxWidth: "100%",
                            }}
                          />
                        </Tooltip>
                      ))}
                      {dayEvents.length > 2 && (
                        <MDTypography variant="caption" color="info" sx={{ fontSize: "0.65rem", mt: 0.25, pl: 0.5 }}>
                          +{dayEvents.length - 2} more
                        </MDTypography>
                      )}
                    </MDBox>
                  </MDBox>
                );
              })}
            </MDBox>
          )}

          {/* ── Legend ── */}
          <MDBox px={3} py={1.5} display="flex" alignItems="center" gap={2} borderTop="1px solid" sx={{ borderColor: "divider" }}>
            <MDBox display="flex" alignItems="center" gap={0.5}>
              <MDBox sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "info.main" }} />
              <MDTypography variant="caption" color="text">Today</MDTypography>
            </MDBox>
            <MDBox display="flex" alignItems="center" gap={0.5}>
              <Chip size="small" color="info" label="" sx={{ height: 12, width: 24 }} />
              <MDTypography variant="caption" color="text">Scheduled Event (click to view)</MDTypography>
            </MDBox>
            <MDTypography variant="caption" color="text" sx={{ ml: "auto" }}>
              {events.length} event{events.length !== 1 ? "s" : ""} total
            </MDTypography>
          </MDBox>
        </Card>
      </MDBox>

      {/* ── Day Detail Dialog ── */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h6" fontWeight="bold">
              {selectedDate?.label}
            </MDTypography>
            <IconButton size="small" onClick={() => setDialogOpen(false)}>
              <Icon>close</Icon>
            </IconButton>
          </MDBox>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {selectedEvents.length === 0 ? (
            <MDBox py={3} textAlign="center">
              <Icon sx={{ fontSize: "2rem !important", opacity: 0.3 }}>event_busy</Icon>
              <MDTypography variant="button" color="text" display="block" mt={1}>
                No events on this day.
              </MDTypography>
            </MDBox>
          ) : (
            <List disablePadding>
              {selectedEvents.map((ev, i) => (
                <ListItem
                  key={ev._id}
                  divider={i < selectedEvents.length - 1}
                  sx={{ px: 2, py: 1.5, cursor: "pointer", "&:hover": { bgcolor: "grey.50" } }}
                  onClick={() => {
                    setDialogOpen(false);
                    navigate(`/events/${ev._id}`);
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon color="info" fontSize="small">event</Icon>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <MDTypography variant="button" fontWeight="medium" display="block">
                        {ev.eventTitle}
                      </MDTypography>
                    }
                    secondary={
                      <MDTypography variant="caption" color="text">
                        {dayjs(ev.eventDate).format("h:mm A")}
                        {ev.location?.title ? ` · ${ev.location.title}` : ""}
                      </MDTypography>
                    }
                  />
                  <Icon fontSize="small" sx={{ color: "text.secondary" }}>chevron_right</Icon>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
}

export default CalendarPage;
