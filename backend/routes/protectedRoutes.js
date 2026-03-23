const express = require("express");
const router = express.Router();

const {
  getStudentDashboard,
  getFacultyDashboard,
  getCRPanel
} = require("../controllers/protectedController");

const { auth, isFaculty, isCR } = require("../middleware/authMiddleware");

router.get("/student", auth, getStudentDashboard);
router.get("/faculty", auth, isFaculty, getFacultyDashboard);
router.get("/cr", auth, isCR, getCRPanel);

module.exports = router;