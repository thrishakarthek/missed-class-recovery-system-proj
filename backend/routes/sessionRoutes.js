const express = require("express");
const router = express.Router();

const {
  createSession,
  getSessionsByClassAndDate,
  uploadFacultySessionNote,
  uploadPeerNote
} = require("../controllers/sessionController");

const { auth, isFaculty } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/create", auth, isFaculty, upload.single("file"), createSession);
router.get("/:classId/:date", auth, getSessionsByClassAndDate);

router.post("/upload-faculty-note", auth, isFaculty, upload.single("file"), uploadFacultySessionNote);
router.post("/upload-peer-note", auth, upload.single("file"), uploadPeerNote);
router.post("/create", auth, isFaculty, upload.single("file"), createSession);

module.exports = router;