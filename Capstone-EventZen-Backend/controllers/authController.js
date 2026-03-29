const User = require("../models/User");

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { fullName, workEmail, mobileNumber, password, agreedToTerms, billingDetails } = req.body;

    // Validate required fields
    if (!fullName || !workEmail || !mobileNumber || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check terms agreement
    if (!agreedToTerms || agreedToTerms === "false") {
      return res.status(400).json({ error: "You must agree to the Terms and Conditions" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ workEmail: workEmail.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create new user (password gets hashed via pre-save hook)
    const user = new User({
      fullName,
      workEmail: workEmail.toLowerCase(),
      mobileNumber,
      password,
      agreedToTerms: agreedToTerms === true || agreedToTerms === "true" || agreedToTerms === "on",
      avatar: req.file ? req.file.path : null,
      billingDetails: typeof billingDetails === "string" ? JSON.parse(billingDetails) : (billingDetails || null),
    });

    await user.save();

    // Return user without password
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        workEmail: user.workEmail,
        mobileNumber: user.mobileNumber,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already registered" });
    }
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// @desc    Login a user
// @route   POST /api/auth/signin
// @access  Public
const signin = async (req, res) => {
  try {
    const { workEmail, password } = req.body;

    if (!workEmail || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ workEmail: workEmail.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare password
    const bcrypt = require("bcryptjs");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT
    const jwt = require("jsonwebtoken");
    const token = jwt.sign({ id: user._id, workEmail: user.workEmail }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        workEmail: user.workEmail,
        mobileNumber: user.mobileNumber,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// @desc    Upgrade user to premium organizer
// @route   POST /api/auth/upgrade
// @access  Private (for now anyone can upgrade via this endpoint for demo)
const upgradeToPremium = async (req, res) => {
  try {
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    const user = await User.findByIdAndUpdate(
      userId,
      { role: "premium" },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({
      message: "Successfully upgraded to Organizer!",
      user: {
        id: user._id,
        fullName: user.fullName,
        workEmail: user.workEmail,
        mobileNumber: user.mobileNumber,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Upgrade error:", error);
    res.status(500).json({ error: "Failed to upgrade account" });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { fullName, mobileNumber, description, location, social } = req.body;
    
    // Using user ID from the protect middleware, or body if bypass used
    const userId = req.user ? req.user._id : req.body.userId;
    
    if (!userId) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const updateFields = {};
    if (fullName !== undefined) updateFields.fullName = fullName;
    if (mobileNumber !== undefined) updateFields.mobileNumber = mobileNumber;
    if (description !== undefined) updateFields.description = description;
    if (location !== undefined) updateFields.location = location;
    if (social !== undefined) updateFields.social = social;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        workEmail: user.workEmail,
        mobileNumber: user.mobileNumber,
        avatar: user.avatar,
        role: user.role,
        description: user.description,
        location: user.location,
        social: user.social,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

module.exports = { signup, signin, upgradeToPremium, updateProfile };
