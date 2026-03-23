const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

const {
  createSubject,
  getAllSubjects,
  getSubjectsByClass
} = require("../controllers/subjectController");

const { uploadGeneralNote } = require("../controllers/subjectController");

const { auth, isFacultyOrCR, isFaculty } = require("../middleware/authMiddleware");

router.post("/create", auth, isFacultyOrCR, createSubject);

// Logged-in users
router.get("/", auth, getAllSubjects);
router.get("/class/:classId", auth, getSubjectsByClass);

router.post(
  "/upload-general-note",
  auth,
  isFaculty,
  upload.single("file"),
  uploadGeneralNote
);

module.exports = router;