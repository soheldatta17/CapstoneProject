const Speaker = require("../models/Speaker");

const SEED_SPEAKERS = [
  {
    name: "Dr. Aisha Rahman",
    role: "AI Research Scientist",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Leading AI researcher with 15+ years in machine learning and neural networks.",
  },
  {
    name: "Marcos Silva",
    role: "Full Stack Engineer",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Senior engineer at a top-tier tech firm, specializing in scalable web architectures.",
  },
  {
    name: "Priya Mehta",
    role: "Product Manager",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    bio: "Award-winning PM who has shipped 20+ products used by millions worldwide.",
  },
  {
    name: "James O'Brien",
    role: "Cybersecurity Expert",
    image: "https://randomuser.me/api/portraits/men/14.jpg",
    bio: "Former government security consultant, now advising Fortune 500 companies.",
  },
  {
    name: "Yuki Tanaka",
    role: "UX Design Lead",
    image: "https://randomuser.me/api/portraits/women/29.jpg",
    bio: "Pioneering human-centred design with over 200 products to her name.",
  },
  {
    name: "Carlos Mendez",
    role: "Blockchain Developer",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    bio: "Co-founder of two Web3 startups, expert in smart contract development.",
  },
  {
    name: "Fatima Al-Sayed",
    role: "Data Scientist",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    bio: "Expert in predictive analytics and big data infrastructure.",
  },
  {
    name: "Ethan Brooks",
    role: "Cloud Architect",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    bio: "AWS certified solutions architect with deep expertise in multi-cloud deployments.",
  },
];

// Seed sample speakers on startup if the collection is empty
const seedSpeakers = async () => {
  try {
    const count = await Speaker.countDocuments();
    if (count === 0) {
      await Speaker.insertMany(SEED_SPEAKERS);
      console.log("✅ Seeded 8 sample speakers.");
    }
  } catch (err) {
    console.error("❌ Failed to seed speakers:", err.message);
  }
};

// GET /api/speakers
const getSpeakers = async (req, res) => {
  try {
    const speakers = await Speaker.find().sort({ name: 1 });
    res.json(speakers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch speakers." });
  }
};

module.exports = { getSpeakers, seedSpeakers };
