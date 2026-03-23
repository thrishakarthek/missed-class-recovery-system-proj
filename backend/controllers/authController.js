const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, isCR, className } = req.body;

    // Check if all required fields are present
    if (!name || !email || !password || !role) {
      return res.status(400).json({
      message: "Name, email, password, and role are required"
    });
    }

  if (role === "student" && !className) {
    return res.status(400).json({
      message: "className is required for students"
    });
  }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isCR: isCR || false,
      className: role === "student" ? className : ""
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isCR: user.isCR,
        className: user.className
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Signup failed",
      error: error.message
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Create token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        isCR: user.isCR,
        className: user.className
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isCR: user.isCR,
        className: user.className
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
};

exports.getFacultyUsers = async (req, res) => {
  try {
    const facultyUsers = await User.find({ role: "faculty" }).select("name email");

    res.status(200).json({
      message: "Faculty users fetched successfully",
      facultyUsers
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching faculty users",
      error: error.message
    });
  }
};