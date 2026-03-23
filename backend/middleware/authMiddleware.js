const jwt = require("jsonwebtoken");

// Verify token
exports.auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided."
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

// Only faculty
exports.isFaculty = (req, res, next) => {
  if (req.user.role !== "faculty") {
    return res.status(403).json({
      message: "Access denied. Faculty only."
    });
  }

  next();
};

// Only CR
exports.isCR = (req, res, next) => {
  if (!req.user.isCR) {
    return res.status(403).json({
      message: "Access denied. Class Representative only."
    });
  }

  next();
};

// Faculty or CR
exports.isFacultyOrCR = (req, res, next) => {
  if (req.user.role === "faculty" || req.user.isCR === true) {
    return next();
  }

  return res.status(403).json({
    message: "Access denied. Faculty or Class Representative only."
  });
};