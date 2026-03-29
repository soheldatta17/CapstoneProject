import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

// EventZen React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

import API_BASE_URL from "apiConfig";

const API_URL = `${API_BASE_URL}/api/auth`;

function Cover() {
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [termsOpen, setTermsOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAvatarChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setAvatarFile(event.target.files[0]);
      setAvatarPreview(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleAutoFillCard = () => {
    setCardNumber("4562 1122 4594 " + Math.floor(1000 + Math.random() * 9000));
    setCardExpiry("11/28");
    setCardCvc("999");
    setNameOnCard(fullName || "Admin User");
  };

  const requiredLabel = (label) => (
    <>
      {label}
      <span style={{ color: "#f44336" }}> *</span>
    </>
  );

  const handleSignUp = async () => {
    setError("");
    setSuccess("");

    // Basic client-side validation
    if (!fullName || !workEmail || !mobileNumber || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!agreed) {
      setError("You must agree to the Terms and Conditions.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("workEmail", workEmail);
      formData.append("mobileNumber", mobileNumber);
      formData.append("password", password);
      formData.append("agreedToTerms", String(agreed));
      if (cardNumber) {
        const billingDetails = {
          cardNumber,
          cardExpiry,
          cardCvc,
          nameOnCard,
        };
        formData.append("billingDetails", JSON.stringify(billingDetails));
      }
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Sign up failed. Please try again.");
      } else {
        setSuccess("Account created successfully! Redirecting to sign in...");
        setTimeout(() => navigate("/authentication/sign-in"), 2000);
      }
    } catch (err) {
      setError(`Cannot connect to server. Make sure the backend is running at ${API_BASE_URL}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CoverLayout
      image={bgImage}
      showFooter={false}
      formGrid={{ xs: 12, sm: 12, md: 10, lg: 8, xl: 7 }}
    >
      <Card sx={{ width: "100%" }}>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join us today
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Create your event admin account
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {error && (
            <MDBox mb={2}>
              <Alert severity="error" onClose={() => setError("")}>
                {error}
              </Alert>
            </MDBox>
          )}
          {success && (
            <MDBox mb={2}>
              <Alert severity="success">{success}</Alert>
            </MDBox>
          )}
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDBox display="flex" justifyContent="center" mb={2}>
                <input
                  accept="image/*"
                  id="avatar-upload"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                />
                <label htmlFor="avatar-upload" style={{ cursor: "pointer" }}>
                  <MDBox display="flex" flexDirection="column" alignItems="center">
                    <Avatar
                      src={avatarPreview || undefined}
                      sx={{
                        width: 74,
                        height: 74,
                        border: "2px solid",
                        borderColor: "info.main",
                        mb: 1,
                      }}
                    >
                      {!avatarPreview && <Icon>person</Icon>}
                    </Avatar>
                    <MDTypography variant="caption" color="info" fontWeight="medium">
                      {requiredLabel("Upload Avatar")}
                    </MDTypography>
                  </MDBox>
                </label>
              </MDBox>
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label={requiredLabel("Full Name")}
                variant="standard"
                fullWidth
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label={requiredLabel("Work Email")}
                variant="standard"
                fullWidth
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label={requiredLabel("Mobile Number")}
                variant="standard"
                fullWidth
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label={requiredLabel("Password")}
                variant="standard"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </MDBox>

            <MDTypography variant="h6" fontWeight="medium" mt={3} mb={1}>
              Billing Information (Optional)
            </MDTypography>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Card Number"
                variant="standard"
                fullWidth
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="0000 0000 0000 0000"
              />
            </MDBox>
            <MDBox mb={2} display="flex" gap={2}>
              <MDBox flex={1}>
                <MDInput
                  type="text"
                  label="Expiry (MM/YY)"
                  variant="standard"
                  fullWidth
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                />
              </MDBox>
              <MDBox flex={1}>
                <MDInput
                  type="text"
                  label="CVC"
                  variant="standard"
                  fullWidth
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                />
              </MDBox>
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Name on Card"
                variant="standard"
                fullWidth
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDButton 
                variant="outlined" 
                color="secondary" 
                size="small" 
                onClick={handleAutoFillCard}
              >
                Auto-Fill Testing Card
              </MDButton>
            </MDBox>

            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ userSelect: "none", ml: -1, lineHeight: 1.4 }}
              >
                &nbsp;&nbsp;I agree the{" "}
                <MDTypography
                  component="span"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                  onClick={() => setTermsOpen(true)}
                  sx={{ cursor: "pointer" }}
                >
                  Terms and Conditions
                </MDTypography>
                <span style={{ color: "#f44336" }}> *</span>
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                onClick={handleSignUp}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : "sign up"}
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      <Dialog open={termsOpen} onClose={() => setTermsOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Terms and Conditions</DialogTitle>
        <DialogContent>
          <MDTypography variant="button" color="text" display="block" mb={1.5}>
            By creating an account, you agree to use this admin portal for authorized event
            planning, attendee communication, and transaction operations.
          </MDTypography>
          <MDTypography variant="button" color="text" display="block" mb={1.5}>
            You are responsible for maintaining accurate event data, protecting attendee privacy,
            and complying with your organization policies.
          </MDTypography>
          <MDTypography variant="button" color="text" display="block">
            Misuse of administrative access may result in account suspension.
          </MDTypography>
        </DialogContent>
        <DialogActions>
          <MDButton variant="outlined" color="secondary" onClick={() => setTermsOpen(false)}>
            Close
          </MDButton>
        </DialogActions>
      </Dialog>
    </CoverLayout>
  );
}

export default Cover;
