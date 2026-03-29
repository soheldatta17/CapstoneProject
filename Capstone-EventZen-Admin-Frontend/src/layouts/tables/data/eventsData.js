import dayjs from "dayjs";

// Images
import bgSignup from "assets/images/bg-sign-up-cover.jpeg";
import bgProfile from "assets/images/bg-profile.jpeg";
import decor1 from "assets/images/home-decor-1.jpg";
import decor2 from "assets/images/home-decor-2.jpg";
import decor3 from "assets/images/home-decor-3.jpg";

import speakersData from "layouts/rtl/data/speakersData";

const locationCatalog = [
  { title: "Grand Hyatt Hotel", address: "New York, NY", type: "hotel", icon: "hotel" },
  { title: "Madison Square Garden", address: "New York, NY", type: "stadium", icon: "stadium" },
  { title: "Moscone Center", address: "San Francisco, CA", type: "convention", icon: "business" },
  { title: "Central Park", address: "New York, NY", type: "park", icon: "park" },
  { title: "Sydney Opera House", address: "Sydney, AUS", type: "theater", icon: "theater_comedy" },
];

const eventsData = [
  {
    id: "evt-540128",
    eventTitle: "Global Fintech Summit 2026",
    eventDate: dayjs("2026-04-18T09:30:00"),
    description: `
  <h4 style="font-weight:600; margin-bottom:8px;">Global Tech & Innovation Summit 2026</h4>

  <p style="margin-bottom:10px;">
    The Global Tech & Innovation Summit 2026 brings together developers, startup founders,
    industry experts, and technology enthusiasts for a full-day experience of learning,
    collaboration, and innovation. The event focuses on emerging technologies, modern
    development practices, artificial intelligence, and the future of digital products.
  </p>

  <p style="margin-bottom:10px;">
    Participants will gain insights from experienced professionals through keynote sessions,
    panel discussions, and live demonstrations of cutting-edge technologies. The summit also
    offers an opportunity to network with professionals, explore new tools, and discover
    innovative ideas that are shaping the future of technology and business.
  </p>

  <h5 style="font-weight:600; margin:10px 0 6px;">Event Highlights</h5>
  <ul style="padding-left:18px; margin-bottom:10px;">
    <li><span>Keynote speeches from industry leaders and technology innovators</span></li>
    <li><span>Panel discussions on AI, cloud computing, cybersecurity, and modern web development</span></li>
    <li><span>Live demonstrations of emerging technologies and developer tools</span></li>
    <li><span>Startup showcase featuring innovative early-stage products</span></li>
    <li><span>Interactive Q&A sessions with expert speakers</span></li>
  </ul>

  <h5 style="font-weight:600; margin:10px 0 6px;">Workshops & Learning</h5>
  <ul style="padding-left:18px; margin-bottom:10px;">
    <li><span>Hands-on AI and Machine Learning workshop</span></li>
    <li><span>Building scalable applications with modern cloud infrastructure</span></li>
    <li><span>Best practices in full-stack development and API design</span></li>
    <li><span>Data visualization and analytics techniques</span></li>
  </ul>

  <h5 style="font-weight:600; margin:10px 0 6px;">Networking Opportunities</h5>
  <ul style="padding-left:18px; margin:0;">
    <li><span>Meet developers, founders, and technology professionals</span></li>
    <li><span>Connect with potential collaborators and mentors</span></li>
    <li><span>Explore career opportunities and startup partnerships</span></li>
    <li><span>Community discussions and informal networking sessions</span></li>
  </ul>
`,
    selectedImage: bgSignup,
    selectedVideo: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    selectedLocation: locationCatalog[2],
    speakers: [speakersData[0], speakersData[4], speakersData[6]],
  },
  {
    id: "evt-540057",
    eventTitle: "Creators Growth Live",
    eventDate: dayjs("2026-04-26T16:00:00"),
    description:
      "<p>An interactive creator economy event about storytelling, monetization, and short-form video strategy.</p>",
    selectedImage: decor1,
    selectedVideo: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    selectedLocation: locationCatalog[0],
    speakers: [speakersData[1], speakersData[2], speakersData[5]],
  },
  {
    id: "evt-539901",
    eventTitle: "Urban Wedding Expo",
    eventDate: dayjs("2026-05-03T11:00:00"),
    description:
      "<p>Top planners, stylists, and photographers share practical planning tips and modern wedding themes.</p>",
    selectedImage: decor2,
    selectedVideo: "",
    selectedLocation: locationCatalog[4],
    speakers: [speakersData[4], speakersData[5]],
  },
  {
    id: "evt-539744",
    eventTitle: "Future of Product Design",
    eventDate: dayjs("2026-05-10T13:30:00"),
    description:
      "<p>Deep-dive talks on design systems, UX research operations, and AI-assisted prototyping workflows.</p>",
    selectedImage: bgProfile,
    selectedVideo: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    selectedLocation: locationCatalog[1],
    speakers: [speakersData[2], speakersData[3], speakersData[6]],
  },
  {
    id: "evt-539600",
    eventTitle: "Outdoor Music Business Meetup",
    eventDate: dayjs("2026-05-22T18:45:00"),
    description:
      "<p>Festival founders and artist managers cover sponsorship strategy, audience growth, and stage operations.</p>",
    selectedImage: decor3,
    selectedVideo: "",
    selectedLocation: locationCatalog[3],
    speakers: [speakersData[0], speakersData[1], speakersData[3]],
  },
];

export default eventsData;
