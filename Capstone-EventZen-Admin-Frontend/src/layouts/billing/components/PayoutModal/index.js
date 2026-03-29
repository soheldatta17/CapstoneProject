import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// @mui material components
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

// EventZen React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

import API_BASE_URL from "apiConfig";

const API_BASE = `${API_BASE_URL}/api`;

function PayoutModal({ open, onClose, onSuccess }) {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);

  // Form State
  const [amount, setAmount] = useState("");
  const [personName, setPersonName] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [speakerOptions, setSpeakerOptions] = useState([]);

  useEffect(() => {
    if (open) {
      fetch(`${API_BASE}/events`)
        .then((res) => res.json())
        .then((data) => setEvents(data))
        .catch((err) => console.error("Could not fetch events", err));
    }
  }, [open]);

  useEffect(() => {
    if (selectedEventId) {
      const event = events.find((e) => e._id === selectedEventId);
      if (event && event.speakers) {
        setSpeakerOptions(event.speakers);
        if (event.speakers.length > 0 && tabValue === 0) {
          setPersonName(event.speakers[0].name);
        }
      }
    } else {
      setSpeakerOptions([]);
      setPersonName("");
    }
  }, [selectedEventId, events]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setAmount("");
    setPersonName("");
    setSelectedEventId("");
    setCustomReason("");
    setSpeakerOptions([]);
  };

  const handleCloseInternal = () => {
    setAmount("");
    setPersonName("");
    setSelectedEventId("");
    setCustomReason("");
    setSpeakerOptions([]);
    setTabValue(0);
    onClose();
  };

  const handlePayout = async () => {
    if (!amount || isNaN(amount)) return;
    setLoading(true);
    try {
      const type = "expense";
      let payload = { amount: Number(amount), type };

      if (tabValue === 0) {
        payload.name = `Speaker Payment - ${personName}`;
        payload.reason = customReason || "Speaker Fee";
        if (selectedEventId) payload.relatedEvent = selectedEventId;
      } else {
        const selectedEvent = events.find((e) => e._id === selectedEventId);
        const venueName = selectedEvent?.venue?.name || "Venue";
        payload.name = `Venue Advance - ${venueName}`;
        payload.reason = "Venue Booking";
        if (selectedEventId) payload.relatedEvent = selectedEventId;
      }

      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(`${API_BASE}/billing/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onSuccess();
        handleCloseInternal();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) return false;
    if (tabValue === 0 && !personName) return false;
    if (tabValue === 1 && !selectedEventId) return false;
    return true;
  };

  const selectedEvent = events.find((e) => e._id === selectedEventId);

  // Shared Select styles to keep height consistent with MDInput
  const selectSx = {
    height: "44px",
    "& .MuiSelect-select": {
      display: "flex",
      alignItems: "center",
      py: "10px",
      "& .menu-avatar": { display: "none" }, // hide avatars in the selected value display
    },
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseInternal}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: "16px", overflow: "visible" } }}
    >
      {/* ── Header ── */}
      <DialogTitle sx={{ pb: 0, pt: 2.5, px: 3, mb: 3 }}>
        <MDTypography variant="h5" fontWeight="medium">
          Issue New Payout
        </MDTypography>
      </DialogTitle>

      {/* ── Content ── */}
      <DialogContent sx={{ px: 3, pt: 2, pb: 1, overflow: "visible" }}>
        {/* Tab switcher */}
        <MDBox mb={3} display="flex" justifyContent="center">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              background: "#F0F2F5",
              borderRadius: "12px",
              p: 0.5,
              minHeight: "unset",
              "& .MuiTabs-indicator": {
                backgroundColor: "white",
                borderRadius: "10px",
                height: "calc(100% - 8px)",
                top: "4px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
              },
              "& .MuiTab-root": {
                minHeight: "36px",
                py: 0.75,
                px: 3,
                zIndex: 1,
                fontWeight: 500,
                fontSize: "0.85rem",
                textTransform: "none",
              },
            }}
          >
            <Tab label="Pay Speaker" />
            <Tab label="Pay Venue" />
          </Tabs>
        </MDBox>

        {/* Form fields */}
        <MDBox display="flex" flexDirection="column" gap={2.5}>
          {/* Event selector — uses native MUI FormControl to avoid broken height */}
          <FormControl fullWidth size="small">
            <InputLabel id="event-label">Select Event</InputLabel>
            <Select
              labelId="event-label"
              value={selectedEventId}
              label="Select Event"
              onChange={(e) => setSelectedEventId(e.target.value)}
              sx={selectSx}
            >
              <MenuItem value="">
                <em style={{ color: "#9e9e9e" }}>None / Manual Payout</em>
              </MenuItem>
              {events.map((e) => (
                <MenuItem
                  key={e._id}
                  value={e._id}
                  sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}
                >
                  <Avatar
                    className="menu-avatar"
                    src={e.coverImage ? `${API_BASE_URL}${e.coverImage}` : ""}
                    variant="rounded"
                    sx={{ width: 28, height: 28, fontSize: "0.75rem" }}
                  >
                    {e.eventTitle?.[0]}
                  </Avatar>
                  <MDTypography variant="button" fontWeight="medium">
                    {e.eventTitle}
                  </MDTypography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* ── Pay Speaker fields ── */}
          {tabValue === 0 && (
            <>
              {speakerOptions.length > 0 ? (
                <FormControl fullWidth size="small">
                  <InputLabel id="speaker-label">Select Speaker</InputLabel>
                  <Select
                    labelId="speaker-label"
                    value={personName}
                    label="Select Speaker"
                    onChange={(e) => setPersonName(e.target.value)}
                    sx={selectSx}
                  >
                    {speakerOptions.map((s) => (
                      <MenuItem
                        key={s.name}
                        value={s.name}
                        sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}
                      >
                        <Avatar className="menu-avatar" src={s.image} sx={{ width: 24, height: 24 }} />
                        <MDTypography variant="button">
                          {s.name}{" "}
                          <span style={{ color: "#9e9e9e", fontWeight: 400 }}>({s.role})</span>
                        </MDTypography>
                      </MenuItem>
                    ))}
                    <MenuItem value="manual" sx={{ color: "#1a73e8", fontStyle: "italic" }}>
                      Manual Entry...
                    </MenuItem>
                  </Select>
                </FormControl>
              ) : null}

              {(speakerOptions.length === 0 || personName === "manual") && (
                <MDInput
                  label="Name / Receiver"
                  fullWidth
                  value={personName === "manual" ? "" : personName}
                  onChange={(e) => setPersonName(e.target.value)}
                />
              )}
            </>
          )}

          {/* ── Pay Venue: show venue info card ── */}
          {tabValue === 1 && selectedEventId && (
            <MDBox
              p={2}
              sx={{
                background: "#F0F2F5",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Icon color="info">business</Icon>
              <MDBox>
                <MDTypography variant="caption" fontWeight="bold" color="secondary">
                  Associated Venue
                </MDTypography>
                <MDTypography variant="subtitle2" display="block" fontWeight="medium">
                  {selectedEvent?.venue?.name || "Venue details not found"}
                </MDTypography>
              </MDBox>
            </MDBox>
          )}

          {/* Amount */}
          <MDInput
            label="Amount (₹)"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {/* Custom reason: only for Pay Venue with no event selected */}
          {tabValue === 1 && !selectedEventId && (
            <MDInput
              label="Reason for payment"
              fullWidth
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="e.g. Venue deposit, Hall rental..."
            />
          )}
        </MDBox>
      </DialogContent>

      {/* ── Actions ── */}
      <DialogActions sx={{ px: 3, py: 2.5, gap: 1 }}>
        <MDButton onClick={handleCloseInternal} color="secondary" variant="text">
          Cancel
        </MDButton>
        <MDButton
          variant="gradient"
          color="info"
          onClick={handlePayout}
          disabled={!isFormValid() || loading}
          sx={{ minWidth: "130px" }}
        >
          {loading ? "Processing..." : "Issue Payout"}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

PayoutModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default PayoutModal;