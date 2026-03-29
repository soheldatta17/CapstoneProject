const Comment = require("../models/Comment");

// GET /api/events/:id/comments
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ eventId: req.params.id })
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments." });
  }
};

// POST /api/events/:id/comments
const addComment = async (req, res) => {
  try {
    const { author, text, userId, avatar } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Comment text is required." });
    }
    const comment = await Comment.create({
      eventId: req.params.id,
      author: author?.trim() || "Admin Team",
      text: text.trim(),
      userId: userId || null,
      avatar: avatar || null,
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to add comment." });
  }
};

module.exports = { getComments, addComment };
