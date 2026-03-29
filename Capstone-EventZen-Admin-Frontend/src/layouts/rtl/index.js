import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// @mui date pickers
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";

// React Quill
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// EventZen React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// EventZen React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Images
import backgroundImage from "assets/images/bg-sign-up-cover.jpeg";

import API_BASE_URL from "apiConfig";

const filter = createFilterOptions();
const API_BASE = API_BASE_URL;

function CreateEvent() {
  const [speakers, setSpeakers] = useState([]);
  const [availableSpeakers, setAvailableSpeakers] = useState([]);
  const [loadingSpeakers, setLoadingSpeakers] = useState(true);

  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState(null);
  const [description, setDescription] = useState("");

  // Keep both the preview URL and the actual File object
  const [selectedImage, setSelectedImage] = useState(null);      // blob URL for preview
  const [selectedImageFile, setSelectedImageFile] = useState(null); // File object
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);

  // Location/Venue State
  const [openLocation, setOpenLocation] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const loadingLocation = openLocation && locationOptions.length === 0;

  // Snackbar feedback
  const [snack, setSnack] = useState({ open: false, severity: "success", message: "" });
  const [publishing, setPublishing] = useState(false);

  // Fetch speakers from API on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/speakers`);
        const data = await res.json();
        setAvailableSpeakers(data);
      } catch {
        setAvailableSpeakers([]);
      } finally {
        setLoadingSpeakers(false);
      }
    })();
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/venues`);
        const data = await res.json();
        if (active) {
          const options = data.map(v => ({
            title: v.name,
            address: v.address,
            type: "venue",
            icon: "place",
            venueId: v._id
          }));
          setLocationOptions(options);
        }
      } catch (err) {
        console.error("Failed to fetch venues", err);
      }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!openLocation) setLocationOptions([]);
  }, [openLocation]);

  // Confirmation Dialog State
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);

  const handleClearAll = () => {
    setSpeakers([]);
    setEventTitle("");
    setEventDate(null);
    setDescription("");
    setSelectedImage(null);
    setSelectedImageFile(null);
    setSelectedVideo(null);
    setSelectedVideoFile(null);
    setSelectedLocation(null);
    setClearConfirmOpen(false);
  };

  const handlePublish = async () => {
    setPublishConfirmOpen(false);
    setPublishing(true);
    try {
      const formData = new FormData();
      formData.append("eventTitle", eventTitle);
      if (eventDate) formData.append("eventDate", eventDate.toISOString());
      formData.append("description", description);
      if (selectedLocation) {
        formData.append("location", JSON.stringify(selectedLocation));
        if (selectedLocation.venueId) {
          formData.append("venue", selectedLocation.venueId);
        }
      }
      if (speakers.length > 0) {
        // Strip local blob image URLs; keep only id/name/role
        const speakersPayload = speakers.map(({ _id, id, name, role, image }) => ({
          speakerId: _id || null,
          name,
          role: role || "Guest Speaker",
          image: image && !image.startsWith("blob:") ? image : null,
        }));
        formData.append("speakers", JSON.stringify(speakersPayload));
      }
      if (selectedImageFile) formData.append("coverImage", selectedImageFile);
      if (selectedVideoFile) formData.append("promoVideo", selectedVideoFile);

      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/events`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to publish event.");

      setSnack({ open: true, severity: "success", message: "🎉 Event published successfully!" });
      handleClearAll();
    } catch (err) {
      setSnack({ open: true, severity: "error", message: err.message });
    } finally {
      setPublishing(false);
    }
  };

  // Add Speaker Dialog State
  const [open, setOpen] = useState(false);
  const [dialogValue, setDialogValue] = useState({ name: "", role: "", image: null });
  const [newSpeakerImage, setNewSpeakerImage] = useState(null);

  const handleClose = () => {
    setDialogValue({ name: "", role: "", image: null });
    setNewSpeakerImage(null);
    setOpen(false);
  };

  const handleDialogSubmit = (event) => {
    event.preventDefault();
    const newSpeaker = {
      id: Date.now(),
      name: dialogValue.name,
      role: dialogValue.role || "Guest Speaker",
      image: newSpeakerImage,
    };
    setSpeakers([...speakers, newSpeaker]);
    handleClose();
  };

  const handleAddSpeaker = (event, newValue) => {
    if (typeof newValue === "string") {
      setTimeout(() => {
        setOpen(true);
        setDialogValue({ name: newValue, role: "", image: null });
      });
    } else if (newValue && newValue.inputValue) {
      setOpen(true);
      setDialogValue({ name: newValue.inputValue, role: "", image: null });
    } else if (newValue) {
      if (!speakers.some((s) => (s._id && s._id === newValue._id) || s.id === newValue.id)) {
        setSpeakers([...speakers, newValue]);
      }
    }
  };

  const handleNewSpeakerImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setNewSpeakerImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleRemoveSpeaker = (id) => {
    setSpeakers(speakers.filter((speaker) => (speaker._id || speaker.id) !== id));
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImageFile(event.target.files[0]);
      setSelectedImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleVideoChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedVideoFile(event.target.files[0]);
      setSelectedVideo(URL.createObjectURL(event.target.files[0]));
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox position="relative" mb={5}>
        <MDBox
          display="flex"
          alignItems="center"
          position="relative"
          minHeight="18.75rem"
          borderRadius="xl"
          sx={{
            backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
              `${linearGradient(
                rgba(gradients.info.main, 0.6),
                rgba(gradients.info.state, 0.6)
              )}, url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "50%",
            overflow: "hidden",
          }}
        />
        <Card
          sx={{
            position: "relative",
            mt: -8,
            mx: 3,
            py: 2,
            px: 2,
          }}
        >
          <MDBox p={3}>
            <MDTypography variant="h4" fontWeight="medium" mb={3} textAlign="center">
              Create New Event
            </MDTypography>
            <MDTypography variant="body2" color="text" textAlign="center" mb={5}>
              Fill in the details below to publish your next majestic event.
            </MDTypography>

            <MDBox component="form" role="form">
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <MDTypography variant="h6" fontWeight="bold" mb={1}>
                    Event Details
                  </MDTypography>
                </Grid>
                <Grid item xs={12}>
                  <MDInput type="text" label="Event Title" fullWidth value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Date & Time"
                      value={eventDate}
                      onChange={(newValue) => setEventDate(newValue)}
                      viewRenderers={{
                        hours: renderTimeViewClock,
                        minutes: renderTimeViewClock,
                        seconds: renderTimeViewClock,
                      }}
                      timeSteps={{ minutes: 1 }}
                      slotProps={{ textField: { fullWidth: true } }}
                      sx={{ width: "100%" }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    open={openLocation}
                    onOpen={() => { setOpenLocation(true); }}
                    onClose={() => { setOpenLocation(false); }}
                    isOptionEqualToValue={(option, value) => option.title === value.title}
                    getOptionLabel={(option) => option.title}
                    options={locationOptions}
                    loading={loadingLocation}
                    value={selectedLocation}
                    onChange={(event, newValue) => { setSelectedLocation(newValue); }}
                    renderOption={(props, option) => (
                      <MDBox component="li" {...props} display="flex" alignItems="center">
                        <Icon color="secondary" sx={{ mr: 2 }}>{option.icon}</Icon>
                        <MDBox>
                          <MDTypography variant="button" fontWeight="medium" display="block">
                            {option.title}
                          </MDTypography>
                          <MDTypography variant="caption" color="text">
                            {option.address}
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Location & Venue"
                        fullWidth
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <Icon color="action">location_on</Icon>
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <>
                              {loadingLocation ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <MDTypography variant="button" color="text" fontWeight="regular">
                    Event Description
                  </MDTypography>
                  <MDBox
                    mt={1}
                    mb={2}
                    sx={{
                      "& .ql-container": { borderRadius: "0 0 8px 8px" },
                      "& .ql-toolbar": { borderRadius: "8px 8px 0 0" },
                    }}
                  >
                    <ReactQuill
                      theme="snow"
                      value={description}
                      onChange={setDescription}
                      style={{ height: "200px", marginBottom: "50px" }}
                    />
                  </MDBox>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                  <MDTypography variant="h6" fontWeight="bold" mt={2} mb={1}>
                    Media Upload
                  </MDTypography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <MDBox
                    border="1px dashed #ccc"
                    borderRadius="lg"
                    p={3}
                    textAlign="center"
                    sx={{ cursor: "pointer", position: "relative", overflow: "hidden", height: "100%" }}
                  >
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="raised-button-file"
                      type="file"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="raised-button-file" style={{ width: "100%", height: "100%", display: "block" }}>
                      {selectedImage ? (
                        <MDBox
                          component="img"
                          src={selectedImage}
                          alt="Event Cover"
                          width="100%"
                          height="300px"
                          sx={{ objectFit: "cover", borderRadius: "8px" }}
                        />
                      ) : (
                        <MDBox display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="300px">
                          <Icon fontSize="large" color="secondary" sx={{ fontSize: "3rem !important" }}>add_photo_alternate</Icon>
                          <MDTypography variant="button" display="block" mt={1}>Upload Event Cover Image</MDTypography>
                        </MDBox>
                      )}
                    </label>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6}>
                  <MDBox
                    border="1px dashed #ccc"
                    borderRadius="lg"
                    p={3}
                    textAlign="center"
                    sx={{ cursor: "pointer", position: "relative", overflow: "hidden", height: "100%" }}
                  >
                    <input
                      accept="video/*"
                      style={{ display: "none" }}
                      id="raised-button-video"
                      type="file"
                      onChange={handleVideoChange}
                    />
                    <label htmlFor="raised-button-video" style={{ width: "100%", height: "100%", display: "block" }}>
                      {selectedVideo ? (
                        <MDBox
                          component="video"
                          src={selectedVideo}
                          controls
                          width="100%"
                          height="300px"
                          sx={{ objectFit: "cover", borderRadius: "8px" }}
                        />
                      ) : (
                        <MDBox display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="300px">
                          <Icon fontSize="large" color="secondary" sx={{ fontSize: "3rem !important" }}>video_call</Icon>
                          <MDTypography variant="button" display="block" mt={1}>Upload Promotional Video</MDTypography>
                        </MDBox>
                      )}
                    </label>
                  </MDBox>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                  <MDTypography variant="h6" fontWeight="bold" mt={2} mb={1}>
                    Speakers
                  </MDTypography>
                </Grid>

                <Grid item xs={12}>
                  <Autocomplete
                    value={null}
                    onChange={(event, newValue) => {
                      if (typeof newValue === "string") {
                        setDialogValue({ name: newValue, role: "", image: null });
                        setOpen(true);
                      } else if (newValue && newValue.inputValue) {
                        setDialogValue({ name: newValue.inputValue, role: "", image: null });
                        setOpen(true);
                      } else if (newValue) {
                        handleAddSpeaker(event, newValue);
                      }
                    }}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params);
                      if (params.inputValue !== "") {
                        filtered.push({ inputValue: params.inputValue, name: `Add "${params.inputValue}"` });
                      }
                      return filtered;
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    options={availableSpeakers}
                    loading={loadingSpeakers}
                    getOptionLabel={(option) => {
                      if (typeof option === "string") return option;
                      if (option.inputValue) return option.inputValue;
                      return option.name;
                    }}
                    renderOption={(props, option) => (
                      <MDBox component="li" {...props}>
                        <MDBox mr={2}>
                          {option.image ? (
                            <Avatar src={option.image} alt={option.name} />
                          ) : (
                            <Icon>add_circle_outline</Icon>
                          )}
                        </MDBox>
                        <MDBox>
                          <MDTypography variant="button" fontWeight="medium">{option.name}</MDTypography>
                          <MDTypography variant="caption" color="text" display="block">
                            {option.role || "Create new speaker"}
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                    )}
                    sx={{ width: "100%" }}
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search or Add Speakers"
                        fullWidth
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingSpeakers ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                <Dialog open={open} onClose={handleClose}>
                  <form onSubmit={handleDialogSubmit}>
                    <DialogTitle>Add New Speaker</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Did not find the speaker in our list? Please, add it!
                      </DialogContentText>
                      <MDBox mb={2} mt={1}>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          value={dialogValue.name}
                          onChange={(event) => setDialogValue({ ...dialogValue, name: event.target.value })}
                          label="Speaker Name"
                          type="text"
                          variant="outlined"
                          fullWidth
                        />
                      </MDBox>
                      <MDBox mb={2}>
                        <TextField
                          margin="dense"
                          id="role"
                          value={dialogValue.role}
                          onChange={(event) => setDialogValue({ ...dialogValue, role: event.target.value })}
                          label="Speaker Role / Title"
                          type="text"
                          variant="outlined"
                          fullWidth
                        />
                      </MDBox>
                      <MDBox mb={2} display="flex" alignItems="center">
                        <input
                          accept="image/*"
                          style={{ display: "none" }}
                          id="raised-button-file-speaker"
                          type="file"
                          onChange={handleNewSpeakerImageChange}
                        />
                        <label htmlFor="raised-button-file-speaker">
                          <MDButton variant="outlined" component="span" color="info">Upload Photo</MDButton>
                        </label>
                        {newSpeakerImage && (
                          <MDBox ml={2}>
                            <Avatar src={newSpeakerImage} alt="New Speaker" />
                          </MDBox>
                        )}
                      </MDBox>
                    </DialogContent>
                    <DialogActions>
                      <MDButton onClick={handleClose} color="secondary">Cancel</MDButton>
                      <MDButton type="submit" color="info">Add</MDButton>
                    </DialogActions>
                  </form>
                </Dialog>

                <Grid item xs={12}>
                  {speakers.length > 0 && (
                    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                      {speakers.map((speaker) => (
                        <ListItem key={speaker._id || speaker.id} sx={{ borderBottom: "1px solid #f0f0f0" }}>
                          <ListItemAvatar>
                            <Avatar src={speaker.image} alt={speaker.name}>
                              {!speaker.image && <Icon>person</Icon>}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={speaker.name}
                            secondary={speaker.role || "Guest Speaker"}
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => handleRemoveSpeaker(speaker._id || speaker.id)}
                            >
                              <Icon color="error">delete</Icon>
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <MDBox mt={2} display="flex" justifyContent="flex-end">
                    <MDButton variant="outlined" color="secondary" sx={{ mr: 2 }} onClick={() => setClearConfirmOpen(true)}>
                      Clear
                    </MDButton>
                    <MDButton
                      variant="gradient"
                      color="info"
                      size="large"
                      onClick={() => setPublishConfirmOpen(true)}
                      disabled={!eventTitle.trim() || !eventDate || !selectedLocation}
                    >
                      Publish Majestic Event
                    </MDButton>
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>
          </MDBox>
        </Card>
      </MDBox>

      {/* ── Clear Confirmation Dialog ── */}
      <Dialog open={clearConfirmOpen} onClose={() => setClearConfirmOpen(false)}>
        <DialogTitle>Clear all fields?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            All entered data will be lost. Are you sure you want to clear the form?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setClearConfirmOpen(false)} color="secondary">Cancel</MDButton>
          <MDButton onClick={handleClearAll} color="error" variant="contained">Yes, Clear</MDButton>
        </DialogActions>
      </Dialog>

      {/* ── Event Preview / Publish Dialog ── */}
      <Dialog
        open={publishConfirmOpen}
        onClose={() => setPublishConfirmOpen(false)}
        fullWidth
        maxWidth="xl"
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            maxHeight: "92vh",
          },
        }}
      >
        {/* ── Fixed Header ── */}
        <DialogTitle sx={{ p: 0, flexShrink: 0, borderBottom: "1px solid", borderColor: "divider" }}>
          {selectedImage ? (
            <MDBox
              component="img"
              src={selectedImage}
              alt="Event Cover"
              sx={{ width: "100%", height: 300, objectFit: "cover", display: "block" }}
            />
          ) : (
            <MDBox
              sx={{
                width: "100%", height: 120, bgcolor: "grey.100",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <Icon sx={{ fontSize: "2.5rem !important", color: "grey.400" }}>image_not_supported</Icon>
            </MDBox>
          )}
          <MDBox px={3} py={2.5}>
            <MDTypography variant="h5" fontWeight="bold" gutterBottom>
              {eventTitle || "Untitled Event"}
            </MDTypography>
            <MDBox display="flex" flexWrap="wrap" gap={3} mt={0.5}>
              {eventDate && (
                <MDBox display="flex" alignItems="center" gap={0.75}>
                  <Icon color="info" sx={{ fontSize: "1.1rem !important" }}>calendar_month</Icon>
                  <MDTypography variant="body2" color="text">
                    {eventDate.format ? eventDate.format("ddd, MMM D YYYY · h:mm A") : String(eventDate)}
                  </MDTypography>
                </MDBox>
              )}
              {selectedLocation && (
                <MDBox display="flex" alignItems="center" gap={0.75}>
                  <Icon color="info" sx={{ fontSize: "1.1rem !important" }}>location_on</Icon>
                  <MDTypography variant="body2" color="text">
                    {selectedLocation.title}{selectedLocation.address ? ` · ${selectedLocation.address}` : ""}
                  </MDTypography>
                </MDBox>
              )}
            </MDBox>
          </MDBox>
        </DialogTitle>

        {/* ── Scrollable Body ── */}
        <DialogContent dividers sx={{ p: 0, overflowY: "auto" }}>
          <MDBox px={3} py={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={speakers.length > 0 ? 7 : 12}>
                {description && description !== "<p><br></p>" && (
                  <MDBox mb={3}>
                    <MDTypography variant="h6" fontWeight="bold" mb={1}>About this Event</MDTypography>
                    <Divider sx={{ mb: 1.5 }} />
                    <MDBox
                      className="ql-snow"
                      sx={{
                        "& .ql-editor, & p": {
                          fontSize: "0.9rem", lineHeight: 1.75, color: "text.secondary", margin: 0, padding: 0,
                        },
                      }}
                    >
                      <div className="ql-editor" style={{ padding: 0 }} dangerouslySetInnerHTML={{ __html: description }} />
                    </MDBox>
                  </MDBox>
                )}
                {selectedVideo && (
                  <MDBox mt={description && description !== "<p><br></p>" ? 1 : 0}>
                    <MDTypography variant="h6" fontWeight="bold" mb={1}>Promotional Video</MDTypography>
                    <Divider sx={{ mb: 1.5 }} />
                    <MDBox
                      component="video"
                      src={selectedVideo}
                      controls
                      sx={{ width: "100%", borderRadius: "10px", display: "block", maxHeight: 360, bgcolor: "#000" }}
                    />
                  </MDBox>
                )}
                {(!description || description === "<p><br></p>") && !selectedVideo && (
                  <MDBox display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={4} sx={{ opacity: 0.45 }}>
                    <Icon sx={{ fontSize: "2rem !important" }}>article</Icon>
                    <MDTypography variant="caption" color="text" mt={1}>No description or video added</MDTypography>
                  </MDBox>
                )}
              </Grid>
              {speakers.length > 0 && (
                <Grid item xs={12} md={5}>
                  <MDBox sx={{ border: "1px solid", borderColor: "divider", borderRadius: "12px", overflow: "hidden" }}>
                    <MDBox px={2} py={1.5} sx={{ borderBottom: "1px solid", borderColor: "divider", bgcolor: "grey.50" }}>
                      <MDTypography variant="button" fontWeight="bold">Speakers ({speakers.length})</MDTypography>
                    </MDBox>
                    <List sx={{ py: 0 }}>
                      {speakers.map((speaker, idx) => (
                        <ListItem
                          key={speaker._id || speaker.id}
                          sx={{
                            py: 1.5, px: 2,
                            borderBottom: idx < speakers.length - 1 ? "1px solid" : "none",
                            borderColor: "divider",
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              src={speaker.image}
                              alt={speaker.name}
                              sx={{ width: 44, height: 44, border: "1px solid", borderColor: "divider" }}
                            >
                              {!speaker.image && <Icon>person</Icon>}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={<MDTypography variant="button" fontWeight="bold" display="block">{speaker.name}</MDTypography>}
                            secondary={<MDTypography variant="caption" color="text">{speaker.role || "Guest Speaker"}</MDTypography>}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </MDBox>
                </Grid>
              )}
            </Grid>
          </MDBox>
        </DialogContent>

        {/* ── Sticky Footer Actions ── */}
        <DialogActions
          sx={{
            flexShrink: 0, px: 3, py: 2,
            borderTop: "1px solid", borderColor: "divider",
            bgcolor: "background.paper",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
        >
          <MDTypography variant="caption" color="text" sx={{ opacity: 0.6 }} />
          <MDBox display="flex" gap={1.5}>
            <MDButton onClick={() => setPublishConfirmOpen(false)} color="secondary" variant="outlined">
              Cancel
            </MDButton>
            <MDButton onClick={handlePublish} color="info" variant="gradient" disabled={publishing}>
              {publishing ? <CircularProgress size={18} color="inherit" /> : "Yes, Publish"}
            </MDButton>
          </MDBox>
        </DialogActions>
      </Dialog>

      {/* ── Success / Error Snackbar ── */}
      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
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

export default CreateEvent;