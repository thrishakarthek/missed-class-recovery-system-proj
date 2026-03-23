const express = require("express");
const router = express.Router();

const {
  getMissedSessions,
  getMissedSummary
} = require("../controllers/missedController");

const { auth } = require("../middleware/authMiddleware");

router.get("/sessions", auth, getMissedSessions);
router.get("/summary", auth, getMissedSummary);

module.exports = router;