const express = require("express");
const router = express.Router();

const { createClass, getClasses } = require("../controllers/classController");
const { auth, isFacultyOrCR } = require("../middleware/authMiddleware");

router.post("/create", auth, isFacultyOrCR, createClass);

// All logged-in users
router.get("/", auth, getClasses);

module.exports = router;