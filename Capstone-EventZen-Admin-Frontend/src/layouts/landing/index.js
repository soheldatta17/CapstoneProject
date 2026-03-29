import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import brandLogo from "assets/images/logo-ct.png";
import "./landing.css";

// Feature card data
const features = [
  {
    icon: "🎟️",
    title: "Event Management",
    desc: "Create, publish and manage events end-to-end from a single unified dashboard.",
  },
  {
    icon: "📊",
    title: "Live Analytics",
    desc: "Real-time ticket sales, revenue charts and attendee insights at your fingertips.",
  },
  {
    icon: "🗓️",
    title: "Smart Calendar",
    desc: "Visual timeline of all upcoming events with conflict detection built in.",
  },
  {
    icon: "💳",
    title: "Billing & Revenue",
    desc: "Track payments, invoices, and payout history with a clear financial overview.",
  },
  {
    icon: "👤",
    title: "Organiser Profiles",
    desc: "Manage your brand, contact info and organisation settings in one place.",
  },
  {
    icon: "🔔",
    title: "Notifications",
    desc: "Instant alerts for registrations, cancellations and important event updates.",
  },
];

// Floating orb component
function Orb({ className }) {
  return <div className={`landing-orb ${className}`} />;
}

Orb.propTypes = {
  className: PropTypes.string.isRequired,
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const heroRef = useRef(null);

  // If already signed in, skip landing and go straight to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Subtle parallax tilt on hero section
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onMove = (e) => {
      const { clientX, clientY, currentTarget } = e;
      const { width, height, left, top } = currentTarget.getBoundingClientRect();
      const x = ((clientX - left) / width - 0.5) * 18;
      const y = ((clientY - top) / height - 0.5) * -10;
      hero.style.setProperty("--tx", `${x}px`);
      hero.style.setProperty("--ty", `${y}px`);
    };
    hero.addEventListener("mousemove", onMove);
    return () => hero.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="landing-root">
      {/* ── Background orbs ── */}
      <Orb className="orb-1" />
      <Orb className="orb-2" />
      <Orb className="orb-3" />

      {/* ── Navbar ── */}
      <nav className="landing-nav">
        <div className="landing-nav-brand">
          <img src={brandLogo} alt="EventZen logo" className="landing-nav-logo" />
          <span className="landing-nav-name">EventZen</span>
        </div>
        <div className="landing-nav-actions">
          <button
            className="landing-btn-ghost"
            onClick={() => navigate("/authentication/sign-in")}
          >
            Sign In
          </button>
          <button
            className="landing-btn-primary"
            onClick={() => navigate("/authentication/sign-up")}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="landing-hero" ref={heroRef}>
        <div className="landing-hero-content">
          <div className="landing-badge">
            <span className="landing-badge-dot" />
            Admin Portal · Event Organisers Only
          </div>
          <h1 className="landing-hero-title">
            Run Your Events
            <br />
            <span className="landing-gradient-text">Like a Pro</span>
          </h1>
          <p className="landing-hero-subtitle">
            EventZen gives organisers one powerful command centre — from ticket
            sales to live analytics — so every event goes off without a hitch.
          </p>
          <div className="landing-hero-cta">
            <button
              className="landing-btn-primary landing-btn-lg"
              onClick={() => navigate("/authentication/sign-up")}
            >
              Create Free Account
              <span className="landing-btn-arrow">→</span>
            </button>
            <button
              className="landing-btn-outline landing-btn-lg"
              onClick={() => navigate("/authentication/sign-in")}
            >
              Sign In to Dashboard
            </button>
          </div>
          <p className="landing-hero-note">
            Already have an account?{" "}
            <span
              className="landing-link"
              onClick={() => navigate("/authentication/sign-in")}
            >
              Sign in here
            </span>
          </p>
        </div>

        {/* Hero card — floating dashboard preview */}
        <div className="landing-hero-visual">
          <div className="landing-card-glass">
            <div className="landing-card-header">
              <span className="landing-card-dot red" />
              <span className="landing-card-dot amber" />
              <span className="landing-card-dot green" />
              <span className="landing-card-title-sm">Dashboard Overview</span>
            </div>
            <div className="landing-card-stats">
              {[
                { label: "Events Live", value: "24", trend: "+3 this week" },
                { label: "Tickets Sold", value: "8.4k", trend: "+12% ↑" },
                { label: "Revenue", value: "₹2.1M", trend: "+8.5% ↑" },
              ].map((s) => (
                <div key={s.label} className="landing-stat">
                  <span className="landing-stat-value">{s.value}</span>
                  <span className="landing-stat-label">{s.label}</span>
                  <span className="landing-stat-trend">{s.trend}</span>
                </div>
              ))}
            </div>
            <div className="landing-card-bar-section">
              <span className="landing-card-bar-label">Ticket Sales · Last 7 days</span>
              <div className="landing-bars">
                {[40, 65, 50, 80, 70, 90, 75].map((h, i) => (
                  <div
                    key={i}
                    className="landing-bar"
                    style={{ "--bar-h": `${h}%`, "--bar-delay": `${i * 0.07}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="landing-features">
        <div className="landing-section-label">Everything You Need</div>
        <h2 className="landing-section-title">Built for Event Organisers</h2>
        <p className="landing-section-sub">
          All the tools a modern event team needs, beautifully unified.
        </p>
        <div className="landing-features-grid">
          {features.map((f) => (
            <div key={f.title} className="landing-feature-card">
              <div className="landing-feature-icon">{f.icon}</div>
              <h3 className="landing-feature-title">{f.title}</h3>
              <p className="landing-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="landing-cta-banner">
        <div className="landing-cta-inner">
          <h2 className="landing-cta-title">Ready to take the stage?</h2>
          <p className="landing-cta-sub">
            Join thousands of organisers already using EventZen to run standout events.
          </p>
          <div className="landing-hero-cta">
            <button
              className="landing-btn-white landing-btn-lg"
              onClick={() => navigate("/authentication/sign-up")}
            >
              Start for Free
              <span className="landing-btn-arrow">→</span>
            </button>
            <button
              className="landing-btn-outline-white landing-btn-lg"
              onClick={() => navigate("/authentication/sign-in")}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="landing-footer-brand">
          <img src={brandLogo} alt="EventZen" className="landing-footer-logo" />
          <span>EventZen Admin</span>
        </div>
        <p className="landing-footer-copy">
          © {new Date().getFullYear()} EventZen. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
