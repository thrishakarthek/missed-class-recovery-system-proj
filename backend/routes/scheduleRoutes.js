const express = require("express");
const router = express.Router();

const {
  createOrUpdateSchedule,
  getScheduleByClassAndDate
} = require("../controllers/scheduleController");

const { auth, isCR } = require("../middleware/authMiddleware");

// CR only
router.post("/create-or-update", auth, isCR, createOrUpdateSchedule);

// Logged-in users
router.get("/:classId/:date", auth, getScheduleByClassAndDate);

module.exports = router;